'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Order } from '@/lib/interface';
import { fetchOrders } from '@/lib/api';
import Modal from './modal.component';

interface CustomerOrdersModalProps {
    open: boolean;
    onClose: () => void;
    customer: { id: string; name: string } | null;
}

export default function CustomerOrdersModal({
    open,
    onClose,
    customer,
}: CustomerOrdersModalProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('')

    const loadOrders = useCallback(async () => {
        if (!customer) return;
        setLoading(true);
        setError(null);
        try {
            const result = await fetchOrders({ customerId: customer.id, search, skip: 0, take: 50 });
            if (!result) {
                setLoading(false)
                setError('failed to fetch orders')
                return;
            }
            setOrders(result);
        } catch (err) {
            console.error('loadOrders failed', err);
            setError('Failed to load orders for this customer.');
        } finally {
            setLoading(false);
        }
    }, [customer]);

    const handleClose = () => {
        setOrders([]);
        setError(null);
        setLoading(false);
        onClose();
    };

    useEffect(() => {
        if (open && customer) {
            const loader = () => loadOrders();
            loader();
        }
    }, [open, customer, loadOrders]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={customer ? `${customer.name} — Orders` : 'Orders'}
        >
            {loading ? (
                <div className="flex items-center justify-center p-12 text-sm text-slate-500">
                    Loading orders...
                </div>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12">
                    <ShoppingBag className="mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-medium text-slate-700">No orders found</p>
                    <p className="mt-1 text-sm text-slate-500">
                        This customer has no orders.
                    </p>
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="border-b text-sm text-slate-500">
                            <th className="px-4 py-3 font-medium">Order</th>
                            <th className="px-4 py-3 font-medium">Title</th>
                            <th className="px-4 py-3 font-medium">Amount</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-slate-900">
                                        {order.order_number}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {formatDate(order.ordered_at)}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-600">
                                    {order.title}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                    ${Number(order.amount).toFixed(2)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/support?customerId=${customer?.id}&orderTitle=${order.title}&orderNumber=${order.order_number}`}
                                        className="text-sm font-medium text-slate-700 underline hover:text-slate-900"
                                    >
                                        Request Refund
                                    </Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Modal>
    );
}