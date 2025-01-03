import { getCards} from "../types/Card.type.ts";
import {toast} from "sonner";
import {useMutation, useQuery} from "react-query";

import {GetPayments, GetPaymentStatic} from "../types/payments.type.ts";
import {PaymentStat} from "../components/pages/admin/Statistic/component/PaymentStatisticGrapth.tsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CreatePayment = {
    cardId:string,
    addressId:string,
    status:string,
    shippingStatus:string
}
export const useCreatePayment = ()=>{

    const accessToken = localStorage.getItem('token');
    const createPaymentRequest = async(payment:CreatePayment):Promise<getCards>=>{

        const response = await fetch(`${API_BASE_URL}/product/payments`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    cardId:payment.cardId,
                    addressId: payment.addressId,
                    status: payment.status,
                    shippingStatus: payment.shippingStatus
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:createPayment,
        isLoading,
        error,
        isSuccess
    } = useMutation("CreatePayment", createPaymentRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('payment successfully created');
        },
    })


    return {
        createPayment,
        isLoading,
        error,
        isSuccess
    }

}
export const useChangeStatus = ()=>{

    const accessToken = localStorage.getItem('token');
    const changePaymentRequest = async(payment:{paymentId:string, status:string}):Promise<getCards>=>{

        const response = await fetch(`${API_BASE_URL}/product/payments/status`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                   paymentId:payment.paymentId,
                    status:payment.status
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:updateStatus,
        isLoading,
        error,
        isSuccess
    } = useMutation("updateChangeStatus", changePaymentRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('status successfully updated');
        },
    })


    return {
        updateStatus,
        isLoading,
        error,
        isSuccess
    }

}
export const useChangeShippingStatus = ()=>{

    const accessToken = localStorage.getItem('token');
    const changePaymentRequest = async(payment:{paymentId:string, status:string}):Promise<getCards>=>{

        const response = await fetch(`${API_BASE_URL}/product/payments/shipping/status`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    paymentId:payment.paymentId,
                    shippingStatus:payment.status
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:updateShippingStatus,
        isLoading,
        error,
        isSuccess
    } = useMutation("updateChangeShippingStatus", changePaymentRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('shipping status successfully updated');
        },
    })


    return {
        updateShippingStatus,
        isLoading,
        error,
        isSuccess
    }

}
export const useGetPayment = ()=>{
    const accessToken = localStorage.getItem('token');
    const getPaymentRequest = async():Promise<GetPayments>=>{

        const response = await fetch(`${API_BASE_URL}/product/payments`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            },
            method:"GET",
        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:payments, isLoading, error, refetch} = useQuery('fetchPayment',getPaymentRequest,
        {retry:1}
    )
    return {payments, isLoading, error, refetch}
}


export const useGetPaymentStatic = (input: PaymentStat)=>{
    const accessToken = localStorage.getItem('token');
    const getPaymentRequest = async():Promise<GetPaymentStatic>=>{

        const queryData = {
            shippingStatus:input.shippingStatus,
            status:input.status,
            fromDate:new Date(2020-12-12).toString(),
            toDate:input.toDate.toString(),
            categoryId:input.category._id,
            collectionId:input.collection._id,
            genderId:input.gender._id,
            brandId:input.brand._id
        }

        const queryString = new URLSearchParams(queryData).toString();

        const response = await fetch(`${API_BASE_URL}/product/payments/admin/static?${queryString}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            },
            method:"GET",
        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:payments, isLoading, error, refetch} = useQuery('fetchPaymentStatic',getPaymentRequest,
        {retry:1}
    )
    return {payments, isLoading, error, refetch}
}