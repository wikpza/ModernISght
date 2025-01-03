import { getCards} from "../types/Card.type.ts";
import {toast} from "sonner";
import {useMutation, useQuery} from "react-query";
import {GetCart} from "../types/Cart.type.ts";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CreatePayment = {
    cardId:string,
    addressId:string,
    status:string,
    shippingStatus:string
}
export const useCreateCart = ()=>{

    const accessToken = localStorage.getItem('token');
    const createCartRequest = async(payment:CreatePayment):Promise<getCards>=>{

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
        mutateAsync:createCard,
        isLoading,
        error,
        isSuccess
    } = useMutation("CreateCart", createCartRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('payment successfully created');
        },
    })


    return {
        createCard,
        isLoading,
        error,
        isSuccess
    }

}


export const useGetCart = ()=>{
    const accessToken = localStorage.getItem('token');
    const getCartRequest = async():Promise<GetCart>=>{

        const response = await fetch(`${API_BASE_URL}/product/cart`,{
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
    const {data:cart, isLoading, error, refetch} = useQuery('fetchCart',getCartRequest,
        {retry:1}
    )
    return {cart, isLoading, error, refetch}
}


export const useAddCart = ()=>{

    const accessToken = localStorage.getItem('token');
    const AddCartRequest = async(payment:{productId:string,sizeId:string, quantity:number }):Promise<getCards>=>{

        const response = await fetch(`${API_BASE_URL}/product/cart`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    productId:payment.productId,
                    sizeId: payment.sizeId,
                    quantity: payment.quantity,
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:addCart,
        isLoading,
        error,
        isSuccess
    } = useMutation("AddCart", AddCartRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('payment successfully created');
        },
    })


    return {
        addCart,
        isLoading,
        error,
        isSuccess
    }

}


export const useDeleteCart = ()=>{

    const accessToken = localStorage.getItem('token');
    const AddCartRequest = async(cart:{productId:string,sizeId:string }):Promise<getCards>=>{

        const response = await fetch(`${API_BASE_URL}/product/cart/${cart.productId}/${cart.sizeId}`,{
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    productId:cart.productId,
                    sizeId: cart.sizeId,
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:deleteCart,
        isLoading,
        error,
        isSuccess
    } = useMutation("DeleteCart", AddCartRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('payment successfully created');
        },
    })


    return {
        deleteCart,
        isLoading,
        error,
        isSuccess
    }

}

