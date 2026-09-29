import axios from "axios"
import { Customer, Order, PaginatedResponse, ProcessRefundResult, RefundDecision, RefundPayload, RefundRequest } from "./interface"

const baseUrl = process.env.NEXT_PUBLIC_API_URL
export async function fetchOrders(options: {
    customerId: string;
    search: string;
    skip: number;
    take: number
}) {
    const {customerId, search, skip = 0, take = 10 } = options;
    try {
        const response = await axios.get<PaginatedResponse<Order>>(
            `${baseUrl}/orders`,
            {
                params: {
                    customerId,
                    search,
                    skip,
                    take
                }
            }
        )

        if (!response) {
            throw new Error('Failed to fetch orders')
        }
        console.log(response)
        return response.data.data;

    } catch (error) {
        console.log(error)
    }
}

export async function fetchCustomers(options: {
    search: string;
    skip: number;
    take: number;
}) {
     const { search, skip = 0, take = 10 } = options;
    try {
        const response = await axios.get<PaginatedResponse<Customer>>(
            `${baseUrl}/customers`,
            {
                params: {
                    search,
                    skip,
                    take
                }
            }
        )

        if (!response) {
            throw new Error('Failed to fetch orders')
        }
        console.log(response)
        return response.data.data;

    } catch (error) {
        console.log(error)
    }
}

export async function requestRefund(payload: RefundPayload) {
    const response = await axios.post<ProcessRefundResult>(`${baseUrl}/refunds/initiate`, payload);
    console.log(response)
    return response.data;
}

export async function fetchRefunds(options: {decision?: RefundDecision, skip: number, take: number}) {
    const response = await axios.get<{requests: RefundRequest[]; total: number;}>(
        `${baseUrl}/refunds`, {
        params: options
    });
    console.log(response.data.requests)
    return response.data.requests;
}
