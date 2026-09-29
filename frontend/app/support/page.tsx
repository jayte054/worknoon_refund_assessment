// 'use client'

// import { useEffect, useState } from 'react'

// type RefundRequest = {
//   id: string
//   customer: string
//   order: string
//   amount: number
//   reason: string
//   status: 'APPROVED' | 'DENIED' | 'ESCALATED'
//   createdAt: string
// }

// export default function SupportPage() {
//   const [requests, setRequests] = useState<RefundRequest[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function loadRequests() {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/refunds`,
//         )

//         const data = await response.json()

//         setRequests(data)
//       } catch (error) {
//         console.error(error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadRequests()
//   }, [])

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-7xl px-6 py-10">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900">
//             Support Dashboard
//           </h1>

//           <p className="mt-2 text-slate-600">
//             Review recent customer refund requests.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           <StatCard
//             label="Total Requests"
//             value={requests.length}
//           />

//           <StatCard
//             label="Escalated"
//             value={
//               requests.filter((r) => r.status === 'ESCALATED').length
//             }
//           />

//           <StatCard
//             label="Approved"
//             value={
//               requests.filter((r) => r.status === 'APPROVED').length
//             }
//           />
//         </div>

//         <div className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
//           <div className="border-b px-6 py-4">
//             <h2 className="font-semibold text-slate-900">
//               Recent Refund Requests
//             </h2>
//           </div>

//           {loading ? (
//             <div className="p-6 text-slate-500">
//               Loading requests...
//             </div>
//           ) : requests.length === 0 ? (
//             <div className="p-6 text-slate-500">
//               No refund requests yet.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-slate-50 text-sm text-slate-500">
//                   <tr>
//                     <th className="px-6 py-4">Customer</th>
//                     <th className="px-6 py-4">Order</th>
//                     <th className="px-6 py-4">Amount</th>
//                     <th className="px-6 py-4">Reason</th>
//                     <th className="px-6 py-4">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y">
//                   {requests.map((request) => (
//                     <tr key={request.id}>
//                       <td className="px-6 py-4 font-medium">
//                         {request.customer}
//                       </td>

//                       <td className="px-6 py-4 text-sm text-slate-600">
//                         {request.order}
//                       </td>

//                       <td className="px-6 py-4 text-sm">
//                         ${request.amount.toFixed(2)}
//                       </td>

//                       <td className="max-w-sm px-6 py-4 text-sm text-slate-600">
//                         {request.reason}
//                       </td>

//                       <td className="px-6 py-4">
//                         <StatusBadge status={request.status} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   )
// }

// function StatCard({
//   label,
//   value,
// }: {
//   label: string
//   value: number
// }) {
//   return (
//     <div className="rounded-xl border bg-white p-6 shadow-sm">
//       <p className="text-sm text-slate-500">{label}</p>

//       <p className="mt-2 text-3xl font-bold text-slate-900">
//         {value}
//       </p>
//     </div>
//   )
// }

// function StatusBadge({
//   status,
// }: {
//   status: RefundRequest['status']
// }) {
//   const styles = {
//     APPROVED: 'bg-green-100 text-green-700',
//     DENIED: 'bg-red-100 text-red-700',
//     ESCALATED: 'bg-yellow-100 text-yellow-700',
//   }

//   return (
//     <span
//       className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
//     >
//       {status}
//     </span>
//   )
// }
'use client';

import { Suspense } from 'react';
import SupportForm from './_components/support-form.component';
import { HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
    const router = useRouter()
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-3xl px-6 py-12">
                <div className="mb-8 px-5">
                    <div className='flex items-center  justify-between'>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Customer Support
                        </h1>
                        <HomeIcon color='black' onClick={() => router.push('/')} />
                    </div>
                    <p className="mt-2 text-slate-600">
                        Tell us about your refund request and our AI assistant will review
                        it.
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="rounded-xl border bg-white p-6 text-slate-500 shadow-sm">
                            Loading…
                        </div>
                    }
                >
                    <SupportForm />
                </Suspense>

                <div className="mt-8 text-center">
                    <a
                        href="/dashboard"
                        className="text-sm font-medium text-slate-600 underline"
                    >
                        Open Support Dashboard
                    </a>
                </div>
            </div>
        </main>
    );
}