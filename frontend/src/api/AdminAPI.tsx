import {toast} from "sonner";
import {useMutation, useQuery} from "react-query";
import {GetEmployer, GetUserCount, GetUserStatic} from "../types/user.type.ts";
import {Product} from "../types/product.type.ts";
import {GetAdminPayments} from "../types/payments.type.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useGetUsers = (input:{userRole?:string, userEmail?:string, page:number, limit:number})=>{
    const accessToken = localStorage.getItem('token');
    const getCartRequest = async():Promise<GetEmployer>=>{
        const params :{page:string, limit:string, userRole?:string, userEmail?:string} = {
            page: input.page.toString(), // Преобразуем в строку
            limit: input.limit.toString(), // Преобразуем в строку
        }

        if(input.userRole) params.userRole = input.userRole
        if(input.userEmail) params.userEmail = input.userEmail

        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`${API_BASE_URL}/user/admin/user?${queryString}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            },
            method:"GET",
        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:users, isLoading, error, refetch} = useQuery('fetchUsers',getCartRequest,
        {retry:1}
    )
    return {users, isLoading, error, refetch}
}

export const useGetPaymentsAdmin = (input:{shippingStatus?:string, searchId?:string, page:number, limit:number, status?:string})=>{
    const accessToken = localStorage.getItem('token');
    const getAdminPaymentRequest = async():Promise<GetAdminPayments>=>{
        const params :{page:string, limit:string, shippingStatus?:string, searchId?:string,  status?:string} = {
            page: input.page.toString(), // Преобразуем в строку
            limit: input.limit.toString(), // Преобразуем в строку
        }

        if(input.shippingStatus) params.shippingStatus = input.shippingStatus
        if(input.searchId) params.searchId = input.searchId
        if(input.status) params.status = input.status

        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`${API_BASE_URL}/product/payments/admin?${queryString}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            },
            method:"GET",
        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:payments, isLoading, error, refetch} = useQuery('fetchAdminPayments',getAdminPaymentRequest,
        {retry:1}
    )
    return {payments, isLoading, error, refetch}
}

export const useUpdateUserRole = ()=>{
    let hasErrorBeenShown = false
    const accessToken = localStorage.getItem('token');
    const updateUserRoleRequest = async({userId, newRole}:{userId:string, newRole:string}):Promise<Product>=>{


        const response = await fetch(`${API_BASE_URL}/user/admin/user/${userId}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(

                {
                    newRole:newRole,
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:updateRole,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateUserRole", updateUserRoleRequest, {
        retry:0,
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error("unable to update produce, try later");
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('product successfully updated');
            hasErrorBeenShown = false;
        },
    })


    return {
        updateRole,
        isLoading,
        error,
        isSuccess
    }

}

export const useGetUsersRoleStatic = ()=>{
    const accessToken = localStorage.getItem('token');
    const getCartRequest = async():Promise<GetUserStatic>=>{

        const response = await fetch(`${API_BASE_URL}/user/admin/user/role/static`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            },
            method:"GET",
        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:users, isLoading, error, refetch} = useQuery('fetchUsersRoleStatic',getCartRequest,
        {retry:1}
    )
    return {users, isLoading, error, refetch}
}
export const useGetUsersRoleCountStatic = (input:{fromDate:Date, toDate:Date})=>{
    const accessToken = localStorage.getItem('token');
    const getCartRequest = async():Promise<{data:GetUserCount[]}>=>{

        const params :{ fromDate?:string,  toDate?:string} = {}
        if(input.fromDate) params.fromDate = input.fromDate.toString()
        if(input.toDate) params.toDate = input.toDate.toString()


        const queryString = new URLSearchParams(params).toString();

        const response = await fetch(`${API_BASE_URL}/user/admin/user/role/count/static?${queryString}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            },
            method:"GET",
        })
        if (!response.ok) {
            toast.error(await response.json());
        }
        return response.json()
    }
    const {data:users, isLoading, error, refetch} = useQuery('fetchUsersRoleStaticCount',getCartRequest,
        {retry:1}
    )
    return {users, isLoading, error, refetch}
}