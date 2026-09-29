'use client'

import { useState } from 'react'
import CustomersPage from './customers/page'

type RefundResult = {
  status: 'APPROVED' | 'DENIED' | 'ESCALATED'
  response: string
  reasoning: string
}

export default function Home() {


  return (
    <main className="min-h-screen bg-slate-50">
      <CustomersPage />
    </main>
  )
}
