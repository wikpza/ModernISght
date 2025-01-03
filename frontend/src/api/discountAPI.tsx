import {getCards} from "../types/Card.type.ts";
import {toast} from "sonner";
import {useMutation} from "react-query";
import {DiscountInfo} from "../types/product.type.ts";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useCreateDiscount = ()=>{

    const accessToken = localStorage.getItem('token');
    const createDiscountRequest = async({discount, productId}:{discount:DiscountInfo, productId:string}):Promise<getCards>=>{

        const response = await fetch(`${API_BASE_URL}/product/discount`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    ...discount,
                    productId
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:createDiscount,
        isLoading,
        error,
        isSuccess
    } = useMutation("CreateDiscount", createDiscountRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('discount successfully created');
        },
    })


    return {
        createDiscount,
        isLoading,
        error,
        isSuccess
    }

}