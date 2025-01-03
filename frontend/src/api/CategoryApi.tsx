import { Category} from "../types.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetCategories = ()=>{
    const getCategoriesRequest = async():Promise<Category[]>=>{

        const response = await fetch(`${API_BASE_URL}/product/category`,{
            method:"GET",

        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:categories, isLoading, error ,isSuccess} = useQuery('fetchCategory',getCategoriesRequest,
        {retry:1}
    )
    return {categories, isLoading, error, isSuccess}
}
export const useDeleteCategory = () =>{

    const deleteCategoryRequest = async(id:string):Promise<Category[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/category/${id}`,
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

    const {mutate:deleteCategory, isLoading, isSuccess, error} = useMutation(deleteCategoryRequest, {
        retry:0,

    })

    return {deleteCategory, isLoading, error, isSuccess}
}
export const useCreateCategory = ()=>{

    const createCategoryRequest = async(category:Category):Promise<Category>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/category`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(category)
            })


        if(!response.ok) toast.error(await response.json())

        return response.json()
    }

    const {mutate:createCategory, isLoading, isSuccess, error} = useMutation(createCategoryRequest, {
        retry:0
    })

    return {createCategory, isLoading, error, isSuccess}
}
export const useUpdateCategory = ()=>{
    let hasErrorBeenShown = false;

    const accessToken = localStorage.getItem('token');
    const updateCategoryRequest = async(category:Category):Promise<Category>=>{
        const response = await fetch(`${API_BASE_URL}/product/category/${category._id}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(category)
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData);
        }
        return response.json()
    }

    const {
        mutateAsync:updateCategory,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateBrand", updateCategoryRequest, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error("unable to update category, try later");
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('category successfully updated');
            hasErrorBeenShown = false;
        },
    })


    return {
        updateCategory,
        isLoading,
        error,
        isSuccess
    }

}

