import {Color} from "../types.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetColors = ()=>{
    const getGendersRequest = async():Promise<Color[]>=>{

        const response = await fetch(`${API_BASE_URL}/product/color`,{
            method:"GET",

        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:colors, isLoading, error} = useQuery('fetchColors',getGendersRequest,
        {retry:1}
    )
    return {colors, isLoading, error}
}
export const useDeleteColor = () =>{

    const deleteColorRequest = async(id:string):Promise<Color[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/color/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(!response.ok){
            throw new Error("Failed to delete  color")
        }
        return response.json()
    }

    const {mutate:deleteColor, isLoading, isSuccess, error} = useMutation(deleteColorRequest, {
        retry:0,

    })

    return {deleteColor, isLoading, error, isSuccess}
}
export const useCreateColor = ()=>{

    const createColorRequest = async(color:Color):Promise<Color>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/color`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(color)
            })


        if(!response.ok) toast.error(await response.json())



        return response.json()
    }

    const {mutate:createColor, isLoading, isSuccess, error} = useMutation(createColorRequest, {
        retry:0
    })

    return {createColor, isLoading, error, isSuccess}
}
export const useUpdateColor = ()=>{
    let hasErrorBeenShown = false;

    const accessToken = localStorage.getItem('token');
    const updateColorRequest = async(color:Color):Promise<Color>=>{
        const response = await fetch(`${API_BASE_URL}/product/color/${color._id}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(color)
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData);
        }
        return response.json()
    }

    const {
        mutateAsync:updateColor,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateGender", updateColorRequest, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error("unable to update color, try later");
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('color successfully updated');
            hasErrorBeenShown = false;
        },
    })


    return {
        updateColor,
        isLoading,
        error,
        isSuccess
    }

}
