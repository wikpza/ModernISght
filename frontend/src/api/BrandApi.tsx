import { Brand} from "../types.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetBrands = ()=>{
    const getBrandRequest = async():Promise<Brand[]>=>{

        const response = await fetch(`${API_BASE_URL}/product/brand`,{
            method:"GET",

        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:brands, isLoading, error} = useQuery('fetchBrands',getBrandRequest,
        {retry:1}
    )
    return {brands, isLoading, error}
}
export const useDeleteBrand = () =>{

    const deleteBrandRequest = async(id:string):Promise<Brand[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/brand/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(!response.ok){
            throw new Error("Failed to delete  category")
        }
        return response.json()
    }

    const {mutate:deleteBrand, isLoading, isSuccess, error} = useMutation(deleteBrandRequest, {
        retry:0,

    })

    return {deleteBrand, isLoading, error, isSuccess}
}
export const useCreateBrand = ()=>{

    const createBrandRequest = async(brand:Brand):Promise<Brand>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/brand`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(brand)
            })


        if(!response.ok) toast.error(await response.json())



        return response.json()
    }

    const {mutate:createBrand, isLoading, isSuccess, error} = useMutation(createBrandRequest, {
        retry:0
    })

    return {createBrand, isLoading, error, isSuccess}
}
export const useUpdateBrand = ()=>{
    let hasErrorBeenShown = false;

    const accessToken = localStorage.getItem('token');
    const updateBrandRequest = async(brand:Brand):Promise<Brand>=>{
        const response = await fetch(`${API_BASE_URL}/product/brand/${brand._id}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(brand)
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData);
        }
        return response.json()
    }

    const {
        mutateAsync:updateBrand,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateBrand", updateBrandRequest, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error("unable to update brand, try later");
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('brand successfully updated');
            hasErrorBeenShown = false;
        },
    })


    return {
        updateBrand,
        isLoading,
        error,
        isSuccess
    }

}
