
import {Address} from "../types.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";
import {handleServerError} from "@/lib/utils.ts";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useUpdateUserAddress = ()=>{


    const accessToken = localStorage.getItem('token');
    const updateUserAddressRequest = async(address:Address):Promise<Address>=>{
        const response = await fetch(`${API_BASE_URL}/user/addresses/${address._id}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(address)
        })
        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }
        return response.json()
    }

    const {
        mutateAsync:updateUserAddress,
        isLoading,
        error,
        isSuccess,
    } = useMutation("UpdateAddress", updateUserAddressRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('address successfully updated');
        },
    })


    return {
        updateUserAddress,
        isLoading,
        error,
        isSuccess

    }

}
export const useGetUserAddresses = ()=>{
    const getUserAddressesRequest = async():Promise<Address[]>=>{
        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/addresses`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        })

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        return response.json()
    }
    const {data:addresses, isLoading, error, refetch} = useQuery('fetchMyAddresses',getUserAddressesRequest,
        {retry:1}
    )
    return {addresses, isLoading, error, refetch}
}

export const useSetPreferredUserAddresses = () =>{
    const setPreferredUserAddresses = async(id:string):Promise<Address[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/addresses/preferred/${id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }
        return response.json()
    }

    const {mutate:setPreferredAddress, isLoading, isSuccess, error} = useMutation(setPreferredUserAddresses, {
        retry:0,

        onSuccess: () => {
            toast.success('address successfully changed');
        },
    })

    return {setPreferredAddress, isLoading, error, isSuccess}
}
export const useDeleteUserAddresses = () =>{
    const deleteUserAddresses = async(id:string):Promise<Address[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/addresses/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }
        return response.json()
    }

    const {mutate:deleteAddress, isLoading, isSuccess, error} = useMutation(deleteUserAddresses, {
        retry:0,

        onSuccess: () => {
            toast.success('address successfully deleted');
        },
    })

    return {deleteAddress, isLoading, error, isSuccess}
}
export const useCreateUserAddresses = ()=>{

    const createUserAddressesRequest = async(address:Address):Promise<Address>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/addresses`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({
                    firstName:address.firstName,
                    lastName:address.lastName,
                    addressLine1:address.addressLine1,
                    addressLine2:address.addressLine2,
                    city:address.city,
                    state:address.state,
                    zipCode:address.zipCode,
                    phoneNumber:address.phoneNumber,
                    preferred:address.preferred,


                })
            })

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        return response.json()
    }

    const {mutate:createAddresses, isLoading, isSuccess, error} = useMutation(createUserAddressesRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('address successfully created');
        },
    })

    return {createAddresses, isLoading, error, isSuccess}
}
