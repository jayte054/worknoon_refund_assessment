import { CustomerEntity } from '../modules/customer/entity/customer.entity';
import { OrderEntity } from '../modules/orders/entity/order.entity';
// import { RefundRequestEntity } from '../modules/refunds/entity/refund.entity';
import { AppDataSource } from './data-source';
import { customerFixtures } from './fixtures/customer-fixture';
import { orderFixtures } from './fixtures/order-fixtures';

function daysAgo(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(10, 0, 0, 0); // pin time so seed is deterministic
  return d;
}

async function seed(): Promise<void> {
  console.log('Connecting to database...');
  await AppDataSource.initialize();

  try {
    console.log('Wiping existing data...');
    // FK-safe order: refunds → orders → customers
    await AppDataSource.query(
      'TRUNCATE TABLE refund_requests, orders, customers RESTART IDENTITY CASCADE',
    );

    console.log(`Seeding ${customerFixtures.length} customers...`);
    const customers =
      await AppDataSource.getRepository(CustomerEntity).save(customerFixtures);
    const customerByEmail = new Map(customers.map((c) => [c.email, c]));

    console.log(`Seeding ${orderFixtures.length} orders...`);
    const orderEntities: Partial<OrderEntity>[] = orderFixtures.map(
      (fixture) => {
        const customer = customerByEmail.get(fixture.customerEmail);
        if (!customer) {
          throw new Error(
            `Unknown customer email in fixture: ${fixture.customerEmail}`,
          );
        }
        return {
          order_number: fixture.order_number,
          title: fixture.title,
          amount: fixture.amount,
          customerId: customer.id,
          status: fixture.status,
          is_final_sale: fixture.is_final_sale,
          is_damaged: fixture.is_damaged,
          is_incorrect_item: fixture.is_incorrect_item,
          ordered_at: daysAgo(fixture.orderedDaysAgo),
          delivered_at:
            fixture.deliveredDaysAgo !== null
              ? daysAgo(fixture.deliveredDaysAgo)
              : undefined,
        };
      },
    );

    await AppDataSource.getRepository(OrderEntity).save(orderEntities);

    // Summary so the operator can see coverage at a glance
    const counts = orderFixtures.reduce(
      (acc, f) => {
        acc[f.expectedDecision] = (acc[f.expectedDecision] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log('');
    console.log('✓ Seed complete');
    console.log(`  Customers: ${customers.length}`);
    console.log(`  Orders:    ${orderEntities.length}`);
    console.log(
      `  Expected outcomes: ${counts.approved ?? 0} approved, ` +
        `${counts.denied ?? 0} denied, ${counts.escalated ?? 0} escalated`,
    );
    console.log('');
    console.log('  Try these order numbers in the UI:');
    console.log('    ORD-1001  → expected: approved (damaged item)');
    console.log('    ORD-1005  → expected: denied (final sale)');
    console.log('    ORD-1008  → expected: escalated (over $500)');
    console.log('    ORD-1011  → try with an injection-style message');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
