'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, Search, ShoppingBag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Order } from '@/lib/interface'
import { fetchOrders } from '@/lib/api'
import { useSearchParams } from 'next/navigation'



export default function OrdersContentPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState<string>('')
    const params = useSearchParams();


    const loadOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchOrders({ customerId: '14b56301-94dd-4619-8d8b-2a151f3dad17', search, skip: 0, take: 50 });
            if (!result) {
                setLoading(false);
                setError('failed to fetch orders')
                return;
            }
            setOrders(result);
        } catch (err) {
            console.error('loadOrders failed', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const load = () => loadOrders();
        load()
    }, [loadOrders, search]);


    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="h-7 w-7 text-slate-700" />

                            <h1 className="text-3xl font-bold text-slate-900">
                                Orders
                            </h1>
                        </div>

                        <p className="mt-2 text-slate-600">
                            View all customer orders available in the system.
                        </p>
                    </div>

                    <button
                        onClick={loadOrders}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${loading ? 'animate-spin' : ''
                                }`}
                        />

                        Refresh
                    </button>
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard
                        label="Total Orders"
                        value={orders.length}
                    />

                    <SummaryCard
                        label="Completed"
                        value={
                            orders.filter(
                                (order) => order.status === 'completed',
                            ).length
                        }
                    />

                    <SummaryCard
                        label="Total Order Value"
                        value={`$${orders
                            .reduce(
                                (total, order) =>
                                    total + Number(order.amount),
                                0,
                            )
                            .toFixed(2)}`}
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
                        <h2 className="font-semibold text-slate-900">
                            All Orders
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="border-b px-6 py-4 flex items-center justify-between gap-4">
                                <h2 className="font-semibold text-slate-900">All Orders</h2>

                                <div className="relative w-full max-w-xs">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by order number..."
                                        className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <ShoppingBag className="mb-3 h-10 w-10 text-slate-300" />

                            <p className="font-medium text-slate-700">
                                No orders found
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                There are currently no orders in the system.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr className="border-b text-sm text-slate-500">
                                        <th className="px-6 py-4 font-medium">
                                            Order
                                        </th>

                                        <th className="px-6 py-4 font-medium">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 font-medium">
                                            Order Date
                                        </th>

                                        <th className="px-6 py-4 font-medium">
                                            Amount
                                        </th>

                                        <th className="px-6 py-4 font-medium">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 font-medium">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-900">
                                                    {order.order_number}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {order.id}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {order.customerId}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {formatDate(order.ordered_at)}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                                $
                                                {Number(order.amount).toFixed(2)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>

                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="text-sm font-medium text-slate-700 underline hover:text-slate-900"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

function SummaryCard({
    label,
    value,
}: {
    label: string
    value: string | number
}) {
    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
                {value}
            </p>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const normalizedStatus = status.toLowerCase()

    const styles: Record<string, string> = {
        completed: 'bg-green-100 text-green-700',
        delivered: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-red-100 text-red-700',
        refunded: 'bg-purple-100 text-purple-700',
    }

    const style =
        styles[normalizedStatus] ?? 'bg-slate-100 text-slate-700'

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {status}
        </span>
    )
}

