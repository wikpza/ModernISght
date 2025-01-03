import { Gender} from "../types.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetGenders = ()=>{
    const getGendersRequest = async():Promise<Gender[]>=>{

        const response = await fetch(`${API_BASE_URL}/product/gender`,{
            method:"GET",

        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:genders, isLoading, error} = useQuery('fetchGenders',getGendersRequest,
        {retry:1}
    )
    return {genders, isLoading, error}
}
export const useDeleteGender = () =>{

    const deleteGenderRequest = async(id:string):Promise<Gender[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/gender/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(!response.ok){
            throw new Error("Failed to delete  gender")
        }
        return response.json()
    }

    const {mutate:deleteGender, isLoading, isSuccess, error} = useMutation(deleteGenderRequest, {
        retry:0,

    })

    return {deleteGender, isLoading, error, isSuccess}
}
export const useCreateGender = ()=>{

    const createGenderRequest = async(gender:Gender):Promise<Gender>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/gender`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(gender)
            })


        if(!response.ok) toast.error(await response.json())



        return response.json()
    }

    const {mutate:createGender, isLoading, isSuccess, error} = useMutation(createGenderRequest, {
        retry:0
    })

    return {createGender, isLoading, error, isSuccess}
}
export const useUpdateGender = ()=>{
    let hasErrorBeenShown = false;

    const accessToken = localStorage.getItem('token');
    const updateGenderRequest = async(gender:Gender):Promise<Gender>=>{
        const response = await fetch(`${API_BASE_URL}/product/gender/${gender._id}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(gender)
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData);
        }
        return response.json()
    }

    const {
        mutateAsync:updateGender,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateGender", updateGenderRequest, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error("unable to update gender, try later");
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('gender successfully updated');
            hasErrorBeenShown = false;
        },
    })


    return {
        updateGender,
        isLoading,
        error,
        isSuccess
    }

}
