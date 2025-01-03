
import {Address} from "../types.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useUpdateUserAddress = ()=>{
    let hasErrorBeenShown = false;

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
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData);
        }
        return response.json()
    }

    const {
        mutateAsync:updateUserAddress,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateAddress", updateUserAddressRequest, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error("unable to update address, try later");
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('address successfully updated');
            hasErrorBeenShown = false;
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
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:addresses, isLoading, error} = useQuery('fetchMyAddresses',getUserAddressesRequest,
        {retry:1}
    )
    return {addresses, isLoading, error}
}

export const useSetPreferredUserAddresses = () =>{
    let hasErrorBeenShown = false
    const setPreferredUserAddresses = async(id:string):Promise<Address[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/addresses/preferred/${id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(!response.ok){
            throw new Error("Failed to set preferred address")
        }
        return response.json()
    }

    const {mutate:setPreferredAddress, isLoading, isSuccess, error} = useMutation(setPreferredUserAddresses, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error( 'An error occurred');
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('address successfully changed');
            hasErrorBeenShown = false;
        },
    })

    return {setPreferredAddress, isLoading, error, isSuccess}
}

export const useDeleteUserAddresses = () =>{
    let hasErrorBeenShown = false
    const deleteUserAddresses = async(id:string):Promise<Address[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/addresses/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(!response.ok){
            throw new Error("Failed to delete  address")
        }
        return response.json()
    }

    const {mutate:deleteAddress, isLoading, isSuccess, error} = useMutation(deleteUserAddresses, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error('An error occurred');
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('address successfully deleted');
            hasErrorBeenShown = false;
        },
    })

    return {deleteAddress, isLoading, error, isSuccess}
}
export const useCreateUserAddresses = ()=>{
    let hasErrorBeenShown = false;

    const createUserAddressesRequest = async(address:Address):Promise<Address>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/addresses`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(address)
            })
        if(!response.ok){
            throw new Error("Failed to create address")
        }
        return response.json()
    }

    const {mutate:createAddresses, isLoading, isSuccess, error} = useMutation(createUserAddressesRequest, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error( 'An error occurred');
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('address successfully created');
            hasErrorBeenShown = false;
        },
    })

    return {createAddresses, isLoading, error, isSuccess}
}
