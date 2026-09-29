'use client'

import { Suspense } from 'react'
import OrdersContentPage from './_components/orders-content.component'



export default function OrdersPage() {


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrdersContentPage />
        </Suspense>
    )
}

