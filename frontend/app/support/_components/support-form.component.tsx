'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { requestRefund } from '@/lib/api';

type BackendDecision = 'approved' | 'denied' | 'escalated';

interface PolicyRuleResult {
  rule: string;
  passed: boolean;
  detail?: string;
}

interface RefundApiResponse {
  requestId: string;
  decision: BackendDecision;
  reason: string;
  customerResponse: string;
  classification: {
    intent: string;
    reason_category: string;
    confidence: number;
    flags: string[];
  } | null;
  policyEvaluation: {
    decision: BackendDecision;
    primary_reason: string;
    rules_checked: PolicyRuleResult[];
  };
}

export default function SupportForm() {
  const searchParams = useSearchParams();

  const customerId = searchParams.get('customerId') ?? '';
  const orderId = searchParams.get('orderId') ?? '';
  const orderNumber = searchParams.get('orderNumber') ?? '';
  const orderTitle = searchParams.get('orderTitle') ?? '';
  const orderAmount = searchParams.get('orderAmount') ?? '';

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RefundApiResponse | null>(null);

  const hasOrderContext = Boolean(orderNumber);

  async function submitRefund() {
    if (!message.trim() || !hasOrderContext) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
    const data = await requestRefund({orderNumber, customerMessage: message})

      setResult(data);
    } catch (err) {
      console.error('submitRefund failed', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {/* Order context */}
        {hasOrderContext ? (
          <div className="mb-6 rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-medium text-slate-700">
              Order {orderNumber}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {orderTitle || '—'}
              {orderAmount ? ` · $${Number(orderAmount).toFixed(2)}` : ''}
            </p>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
            No order selected. Start from the{' '}
            <a href="/customers" className="font-medium underline">
              customers page
            </a>{' '}
            and pick an order to refund.
          </div>
        )}

        <label className="mb-2 block text-sm font-medium text-slate-700">
          What happened?
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: My headphones arrived damaged…"
          rows={6}
          disabled={!hasOrderContext || loading}
          className="w-full rounded-lg border border-slate-300 p-4 outline-none focus:border-slate-500 disabled:bg-slate-50 disabled:text-slate-400 text-black"
        />

        <button
          onClick={submitRefund}
          disabled={loading || !message.trim() || !hasOrderContext}
          className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Reviewing request…' : 'Request Refund'}
        </button>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {result && <RefundResultCard result={result} />}
    </>
  );
}

function RefundResultCard({ result }: { result: RefundApiResponse }) {
  const decision = result.decision;

  const Icon =
    decision === 'approved'
      ? CheckCircle2
      : decision === 'denied'
        ? XCircle
        : AlertCircle;

  const tone =
    decision === 'approved'
      ? 'text-green-600'
      : decision === 'denied'
        ? 'text-red-600'
        : 'text-yellow-600';

  return (
    <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Refund Decision
        </h2>
        <StatusBadge decision={decision} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">
          Customer response
        </p>
        <p className="mt-2 text-slate-700">{result.customerResponse}</p>
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${tone}`} />
          <p className="text-sm font-medium text-slate-700">
            {result.policyEvaluation.primary_reason}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {result.policyEvaluation.rules_checked.map((rule) => (
            <div
              key={rule.rule}
              className="flex items-start gap-2 text-sm"
            >
              <span
                className={
                  rule.passed
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {rule.passed ? '✓' : '✗'}
              </span>
              <div>
                <p className="font-medium text-slate-700">
                  {formatRuleName(rule.rule)}
                </p>
                {rule.detail && (
                  <p className="text-xs text-slate-500">{rule.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {result.classification?.flags?.length ? (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-800">
            AI flags
          </p>
          <p className="mt-1 text-sm text-yellow-700">
            {result.classification.flags.join(', ')}
          </p>
        </div>
      ) : null}

      <div className="mt-6 border-t pt-4">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 underline hover:text-slate-900"
        >
          View in Support Dashboard
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function StatusBadge({ decision }: { decision: BackendDecision }) {
  const styles: Record<BackendDecision, string> = {
    approved: 'bg-green-100 text-green-700',
    denied: 'bg-red-100 text-red-700',
    escalated: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${styles[decision]}`}
    >
      {decision}
    </span>
  );
}

function formatRuleName(rule: string): string {
  return rule
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}