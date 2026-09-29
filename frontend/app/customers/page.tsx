'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Users, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Customer } from '@/lib/interface';
import { fetchCustomers } from '@/lib/api';
import SummaryCard from './_components/summary-card.component';
import CustomerOrdersModal from './_components/customer-orders-modal.component';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');

    const [ordersModalOpen, setOrdersModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const router = useRouter()

    const loadCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchCustomers({ search, skip: 0, take: 50 });
            if (!result) {
                setLoading(false)
                setError('failed to fetch customers')
                return
            }
            setCustomers(result);
        } catch (err) {
            console.error('loadCustomers failed', err);
            setError('Failed to load customers. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [search, fetchCustomers]);

    useEffect(() => {
        const load = () => loadCustomers();
        load()
    }, [loadCustomers, search]);

    const flaggedCount = customers.filter((c) => c.is_flagged).length;

    const handleViewOrders = (customer: Customer) => {
        console.log(customer)
        setSelectedCustomer(customer);
        setOrdersModalOpen(true);
    };

    const handleCloseModal = () => {
        setOrdersModalOpen(false);
        setSelectedCustomer(null);
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <Users className="h-7 w-7 text-slate-700" />
                            <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
                        </div>
                        <p className="mt-2 text-slate-600">
                            View all customers and their order history.
                        </p>
                    </div>
                    <div className='flex gap-2'>
                        <span onClick={() => router.push('/refund-requests')} className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
                            Refund Requests
                        </span>
                        <button
                            onClick={loadCustomers}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard label="Total Customers" value={customers.length} />
                    <SummaryCard label="Flagged" value={flaggedCount} />
                    <SummaryCard
                        label="Unflagged"
                        value={customers.length - flaggedCount}
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h2 className="font-semibold text-slate-900">All Customers</h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="text-sm text-slate-500">Loading customers...</div>
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <Users className="mb-3 h-10 w-10 text-slate-300" />
                            <p className="font-medium text-slate-700">No customers found</p>
                            <p className="mt-1 text-sm text-slate-500">
                                There are currently no customers in the system.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr className="border-b text-sm text-slate-500">
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Notes</th>
                                        <th className="px-6 py-4 font-medium">Joined</th>
                                        <th className="px-6 py-4 font-medium">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {customers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-900">
                                                    {customer.name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {customer.id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {customer.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                {customer.is_flagged ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Flagged
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Active
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {customer.notes ?? '—'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {formatDate(customer.createdAt)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleViewOrders(customer)}
                                                    className="text-sm font-medium text-slate-700 underline hover:text-slate-900 cursor-pointer"
                                                >
                                                    View Orders
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <CustomerOrdersModal
                open={ordersModalOpen}
                onClose={handleCloseModal}
                customer={selectedCustomer}
            />
        </main>
    );
}

