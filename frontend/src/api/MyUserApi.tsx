import {useMutation, useQuery} from "react-query";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import {PersonalDetailsFormData} from "../components/forms/PersonalDetailForm.tsx";
import {User, UserInfo, UserLogIn, UserRegistration, UserSession} from "../types/user.type.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const useLoginMyUser = () => {


    const loginMyUserRequest = async (user: UserLogIn): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData);
        }
        const responseData = await response.json()

        if (!response.ok) {
            toast.error(responseData);
        }

        localStorage.setItem('token', responseData.token as string);
        const userData = await jwtDecode<User>(responseData.token);
        return  userData
    };

    const { mutateAsync: loginUser, isLoading, error, isSuccess, data } = useMutation(loginMyUserRequest, {
        onError: () => {
            toast.error("Wrong password or email");

        },
        retry:0,
        onSuccess: () => {
            toast.success('shipping status successfully updated');
        },
    });
    return {
        loginUser,
        isLoading,
        error,
        isSuccess,
        userData:data
    };
};
export const useCreateMyUser = () => {
    let hasErrorBeenShown = false;
    const createMyUserRequest = async (user: UserRegistration): Promise<UserSession> => {
        const response = await fetch(`${API_BASE_URL}/user/registration`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData);
        }

        return await response.json();
    };

    const { mutateAsync: createUser, isLoading, error, isSuccess, data:userSession } = useMutation(createMyUserRequest, {
        onError: () => {
            if (!hasErrorBeenShown) {
                toast.error( 'An error occurred');
                hasErrorBeenShown = true;
            }
        },
        onSuccess: () => {
            toast.success('User successfully created');
            hasErrorBeenShown = false;
        },
    });

    return {
        createUser,
        isLoading,
        error,
        isSuccess,
        userSession
    };
};

export const useUpdateMyUser = () => {
    const accessToken = localStorage.getItem('token');

    const updateMyUserRequest = async (PersonalDetailsFormData: PersonalDetailsFormData): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization:`Bearer ${accessToken}`
            },
            body: JSON.stringify(PersonalDetailsFormData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData);
        }
        const responseData = await response.json()
        localStorage.setItem('token', responseData as string);
        return  jwtDecode<User>(responseData);
    };

    const { mutateAsync: updateUser, isLoading, error, isSuccess, data:userData } = useMutation(updateMyUserRequest, {
        onError: () => {
            toast.error("Unable to update user");

        },
        onSuccess: () => {
            toast.success('User successfully updated');

        },
    });

    return {
        updateUser,
        isLoading,
        error,
        isSuccess,
        userData
    };
};

export const useGetUserInfo = ()=>{
    const getUserInfoRequest = async():Promise<UserInfo>=>{
        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user`,{
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
    const {data:userInfo, isLoading, error} = useQuery('fetchMyUserInfo',getUserInfoRequest,
        {retry:0}
    )
    return {userInfo, isLoading, error}
}

export const useVerifyEmail= (id:string | undefined)=>{
    if(!id) throw new Error('unable to verify email')
    const verifyEmailRequest = async():Promise<User>=>{

        const response = await fetch(`${API_BASE_URL}/user/verify/${id}`,{
            method:"GET"
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        const responseData = await response.json()
        localStorage.setItem('token', responseData.token as string);
        return  jwtDecode<User>(responseData.token);
    }
    const {data:userData, isLoading, isError,isSuccess} = useQuery('fetchVerifyEmail',verifyEmailRequest,
        {retry:0}
    )
    return {userData, isLoading, isError, isSuccess}
}
