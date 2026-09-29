import { CustomerEntity } from '../../modules/customer/entity/customer.entity';

export const customerFixtures: Partial<CustomerEntity>[] = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    is_flagged: false,
    notes: 'Loyal customer, 3 years',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Carol Williams',
    email: 'carol@example.com',
    is_flagged: false,
    notes: 'Frequent buyer',
  },
  {
    name: 'David Brown',
    email: 'david@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Eve Davis',
    email: 'eve@example.com',
    is_flagged: true,
    notes: 'Prior refund abuse reported',
  },
  {
    name: 'Frank Miller',
    email: 'frank@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Grace Wilson',
    email: 'grace@example.com',
    is_flagged: false,
    notes: 'VIP tier',
  },
  {
    name: 'Henry Moore',
    email: 'henry@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Ivy Taylor',
    email: 'ivy@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Jack Anderson',
    email: 'jack@example.com',
    is_flagged: true,
    notes: 'Multiple chargebacks',
  },
  {
    name: 'Kate Thomas',
    email: 'kate@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Liam Jackson',
    email: 'liam@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Mia White',
    email: 'mia@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Noah Harris',
    email: 'noah@example.com',
    is_flagged: false,
    notes: null,
  },
  {
    name: 'Olivia Martin',
    email: 'olivia@example.com',
    is_flagged: false,
    notes: null,
  },
];
