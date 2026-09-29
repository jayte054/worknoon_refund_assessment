'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
    RefreshCw,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink,
    HomeIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
// import { RefundRequest, BackendDecision } from '@/lib/interface';
// import { fetchRefunds } from '@/lib/api';
import { BackendDecision, RefundRequest } from '@/lib/interface';
import { fetchRefunds } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RefundRequestPage() {
    const [requests, setRequests] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<BackendDecision | 'all'>('all');
    const router = useRouter()

    const loadRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchRefunds({
                decision: filter === 'all' ? undefined : filter,
                skip: 0,
                take: 50,
            });
            setRequests(result);
        } catch (err) {
            console.error('loadRequests failed', err);
            setError('Failed to load refund requests. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        const load = () => loadRequests();
        load()
    }, [loadRequests]);

    const counts = {
        total: requests.length,
        approved: requests.filter((r) => r.decision === 'approved').length,
        denied: requests.filter((r) => r.decision === 'denied').length,
        escalated: requests.filter((r) => r.decision === 'escalated').length,
        injections: requests.filter((r) => r.had_injection_attempt).length,
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Refund Requests
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Review refund requests, decision outcomes, and reasoning.
                        </p>
                    </div>

                    <div className='flex gap-2 items-center'>
                        <HomeIcon size='25' color='black' onClick={() => router.push('/')} className='cursor-pointer' />
                        <button
                            onClick={loadRequests}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <SummaryCard label="Total" value={counts.total} />
                    <SummaryCard
                        label="Approved"
                        value={counts.approved}
                        tone="green"
                    />
                    <SummaryCard label="Denied" value={counts.denied} tone="red" />
                    <SummaryCard
                        label="Escalated"
                        value={counts.escalated}
                        tone="yellow"
                    />
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {(['all', 'approved', 'denied', 'escalated'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === f
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}

                    {counts.injections > 0 && (
                        <div className="ml-auto flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700">
                            <ShieldAlert className="h-4 w-4" />
                            {counts.injections} injection attempt
                            {counts.injections === 1 ? '' : 's'} detected
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* List */}
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h2 className="font-semibold text-slate-900">
                            Refund Requests ({requests.length})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-12 text-sm text-slate-500">
                            Loading requests...
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12">
                            <AlertCircle className="mb-3 h-10 w-10 text-slate-300" />
                            <p className="font-medium text-slate-700">
                                No refund requests found
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Requests submitted from the customer page will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {requests.map((request) => (
                                <RequestRow key={request.id} request={request} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

function RequestRow({ request }: { request: RefundRequest }) {
    const [expanded, setExpanded] = useState(false);

    const decisionIcon =
        request.decision === 'approved' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : request.decision === 'denied' ? (
            <XCircle className="h-4 w-4 text-red-600" />
        ) : (
            <AlertCircle className="h-4 w-4 text-yellow-600" />
        );

    return (
        <div className="transition hover:bg-slate-50">
            {/* Collapsed row */}
            <button
                onClick={() => setExpanded((v) => !v)}
                className="grid w-full grid-cols-12 items-center gap-4 px-6 py-4 text-left"
            >
                <div className="col-span-3">
                    <p className="text-sm font-medium text-slate-900">
                        {request.order?.order_number ?? '—'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        {request.order?.title ?? 'Unknown customer'}
                    </p>
                </div>

                <div className="col-span-2 text-sm text-slate-600">
                    ${Number(request.order?.amount ?? 0).toFixed(2)}
                </div>

                <div className="col-span-3 truncate text-sm text-slate-600">
                    {request.customer_message}
                </div>

                <div className="col-span-2 flex items-center gap-2">
                    {decisionIcon}
                    <span className="text-sm font-medium capitalize text-slate-700">
                        {request.decision}
                    </span>
                    {request.had_injection_attempt && (
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    )}
                </div>

                <div className="col-span-2 text-right text-xs text-slate-500">
                    {formatDate(request.created_at)}
                </div>
            </button>

            {/* Expanded details */}
            {expanded && (
                <div className="border-t bg-slate-50 px-6 py-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Order + message */}
                        <section>
                            <h3 className="text-sm font-semibold text-slate-700">
                                Order
                            </h3>
                            <div className="mt-2 rounded-lg border bg-white p-4 text-sm">
                                <p className="font-medium text-slate-900">
                                    {request.order?.order_number}
                                </p>
                                <p className="mt-1 text-slate-500">
                                    {request.order?.title} — $
                                    {Number(request.order?.amount ?? 0).toFixed(2)}
                                </p>
                                {/* <p className="mt-1 text-xs text-slate-400">
                                    Customer: {request.order?.customer?.name} (
                                    {request.order?.customer?.email})
                                </p> */}
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-700">
                                Customer message
                            </h3>
                            <p className="mt-2 rounded-lg border bg-white p-4 text-sm text-slate-700">
                                {request.customer_message}
                            </p>
                        </section>

                        {/* AI classification */}
                        <section>
                            <h3 className="text-sm font-semibold text-slate-700">
                                AI classification
                            </h3>
                            {request.ai_classification ? (
                                <div className="mt-2 rounded-lg border bg-white p-4 text-sm">
                                    <div className="grid grid-cols-2 gap-y-2">
                                        <span className="text-slate-500">Intent</span>
                                        <span className="text-slate-900">
                                            {request.ai_classification.intent}
                                        </span>

                                        <span className="text-slate-500">Reason</span>
                                        <span className="text-slate-900">
                                            {request.ai_classification.reason_category}
                                        </span>

                                        <span className="text-slate-500">Confidence</span>
                                        <span className="text-slate-900">
                                            {(request.ai_classification.confidence * 100).toFixed(0)}%
                                        </span>

                                        <span className="text-slate-500">Flags</span>
                                        <span className="text-slate-900">
                                            {request.ai_classification.flags.length > 0 ? (
                                                <span className="flex flex-wrap gap-1">
                                                    {request.ai_classification.flags.map((flag) => (
                                                        <span
                                                            key={flag}
                                                            className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                                                        >
                                                            {flag}
                                                        </span>
                                                    ))}
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-2 rounded-lg border bg-white p-4 text-sm text-slate-400">
                                    No classification recorded
                                </p>
                            )}
                        </section>

                        {/* Policy evaluation */}
                        <section className="lg:col-span-2">
                            <h3 className="text-sm font-semibold text-slate-700">
                                Policy evaluation
                            </h3>
                            {request.policy_evaluation ? (
                                <div className="mt-2 rounded-lg border bg-white p-4">
                                    <p className="mb-3 text-sm text-slate-600">
                                        <strong className="text-slate-900">Primary reason:</strong>{' '}
                                        {request.policy_evaluation.primary_reason}
                                    </p>

                                    <div className="space-y-1.5">
                                        {request.policy_evaluation.rules_checked.map((rule) => (
                                            <div
                                                key={rule.rule}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <span
                                                    className={
                                                        rule.passed ? 'text-green-600' : 'text-red-600'
                                                    }
                                                >
                                                    {rule.passed ? '✓' : '✗'}
                                                </span>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        {rule.rule}
                                                    </span>
                                                    {rule.detail && (
                                                        <span className="ml-2 text-xs text-slate-500">
                                                            {rule.detail}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-2 rounded-lg border bg-white p-4 text-sm text-slate-400">
                                    No policy trace recorded
                                </p>
                            )}
                        </section>

                        {/* Customer response */}
                        {request.customer_response && (
                            <section className="lg:col-span-2">
                                <h3 className="text-sm font-semibold text-slate-700">
                                    Response sent to customer
                                </h3>
                                <p className="mt-2 rounded-lg border bg-white p-4 text-sm text-slate-700">
                                    {request.customer_response}
                                </p>
                            </section>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({
    label,
    value,
    tone = 'slate',
}: {
    label: string;
    value: number;
    tone?: 'slate' | 'green' | 'red' | 'yellow';
}) {
    const tones = {
        slate: 'text-slate-900',
        green: 'text-green-600',
        red: 'text-red-600',
        yellow: 'text-yellow-600',
    };

    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${tones[tone]}`}>{value}</p>
        </div>
    );
}