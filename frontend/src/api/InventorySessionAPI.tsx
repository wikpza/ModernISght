import { useQuery} from "react-query";
import { InventorySessionList} from "../types/inventory.type.ts";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const UseGetProductInventorySession = (productId:string, page:number)=>{
    const accessToken = localStorage.getItem('token');

    const getProductInventorySessionRequest = async():Promise<{sessionList:InventorySessionList[], page:number}>=>{

        const response = await fetch(`${API_BASE_URL}/product/inventory/session/${productId}?page=${page}`,{
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
    const {data:productInventory, isLoading, error} = useQuery('fetchProductInventorySession',getProductInventorySessionRequest,
        {retry:1}
    )
    return {productInventory, isLoading, error}
}

