
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";
import {GetSizes, Sizes} from "../types/size.type.ts";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetSizes = ()=>{
    const getSizesRequest = async():Promise<GetSizes[]>=>{
        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/size`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:sizes, isLoading, error} = useQuery('fetchSizes',getSizesRequest,
        {retry:1}
    )
    return {sizes, isLoading, error}
}

export const useCreateSizes = ()=>{

    const createSizesRequest = async(size:{genderId:string, categoryId:string, values:string[]}):Promise<Sizes>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/size`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(size)
            })


        if(!response.ok) toast.error(await response.json())


        return response.json()
    }

    const {mutate:createSize, isLoading, isSuccess, error} = useMutation(createSizesRequest, {
        retry:0
    })

    return {createSize, isLoading, error, isSuccess}
}

export const useAddSize = ()=>{

    const AddSizeRequest = async({newValue, id}:{newValue:string, id:string}):Promise<Sizes>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/size/add/${id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({newValue:newValue})
            })


        if(!response.ok) toast.error(await response.json())


        return response.json()
    }

    const {mutate:addSize, isLoading, isSuccess, error} = useMutation(AddSizeRequest, {
        retry:0
    })

    return {addSize, isLoading, error, isSuccess}
}

export const useUpdateSizeValue = ()=>{

    const updateSizeValueRequest = async({newValue, sizeId, id}:{newValue:string, sizeId:string, id:string}):Promise<Sizes>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/size/${id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({newValue, sizeId})
            })


        if(!response.ok) toast.error(await response.json())


        return response.json()
    }

    const {mutate:updateSizeValue, isLoading, isSuccess, error} = useMutation(updateSizeValueRequest, {
        retry:0
    })


    return {updateSizeValue, isLoading, error, isSuccess}
}

export const useDeleteSizes = ()=>{

    const DeleteSizeValueRequest = async(id:string):Promise<Sizes>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/size/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({id})
            })


        if(!response.ok) toast.error(await response.json())


        return response.json()
    }

    const {mutate:deleteSizes, isLoading, isSuccess, error} = useMutation(DeleteSizeValueRequest, {
        retry:0
    })

    return {deleteSizes, isLoading, error, isSuccess}
}

export const useDeleteSizeValue = ()=>{

    const DeleteSizeValueRequest = async({id, sizeId}:{id: string, sizeId:string}):Promise<Sizes>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/size/delete/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({sizeId})
            })


        if(!response.ok) toast.error(await response.json())


        return response.json()
    }

    const {mutate:deleteSizeValue, isLoading, isSuccess, error} = useMutation(DeleteSizeValueRequest, {
        retry:0
    })

    return {deleteSizeValue, isLoading, error, isSuccess}
}