import {useMutation, useQuery} from "react-query";
import {getInventory, InventorySessionType} from "../types/inventory.type.ts";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetProductInventory = (productId:string)=>{
    const getProductInventoryRequest = async():Promise<getInventory[]>=>{
        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/inventory/${productId}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:productInventory, isLoading, error} = useQuery('fetchProductInventory',getProductInventoryRequest,
        {retry:1}
    )
    return {productInventory, isLoading, error}
}


export const useGetProductInventoryUser = (productId:string)=>{
    const getProductInventoryUserRequest = async():Promise<getInventory[]>=>{

        const response = await fetch(`${API_BASE_URL}/product/inventory/${productId}/count`,{
            method:"GET",
        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:productInventory, isLoading, error, refetch} = useQuery('fetchInventoryProductVariant',getProductInventoryUserRequest,
        {retry:1}
    )
    return {productInventory, isLoading, error, refetch}
}

export const usePatchProductInventory = () => {
    const accessToken = localStorage.getItem('token');

    const patchProductInventoryRequest = async (
        input:
            {
                quantity: number,
                sizeId: string,
                productId:string,
                type:string
            }): Promise<InventorySessionType> => {

        const response = await fetch(`${API_BASE_URL}/product/inventory/change`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(input)
        });

        if (!response.ok) {
            toast.error(await response.json());
        }

        return response.json();
    };

    const {
        mutateAsync: patchProductInventory,
        isLoading,
        error,
        isSuccess
    } = useMutation("PatchProductInventory", patchProductInventoryRequest, {
        retry: 0,
        onSuccess: () => {
            toast.success('Product variant successfully added');
        },
    });

    return {
        patchProductInventory,
        isLoading,
        error,
        isSuccess
    };
};