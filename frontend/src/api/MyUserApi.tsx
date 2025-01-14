import {useMutation, useQuery} from "react-query";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import {PersonalDetailsFormData} from "../components/forms/PersonalDetailForm.tsx";
import {User, UserInfo, UserLogIn, UserRegistration, UserSession} from "../types/user.type.ts";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "@/lib/utils.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useLoginMyUser = () => {
    const loginMyUserRequest = async (user: UserLogIn): Promise<{
        user?: User;
        response?: FormErrors | { message: string};
        status:number
    }> => {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }

        localStorage.setItem("token", responseData.token as string);
        const userData = await jwtDecode<User>(responseData.token);

        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { user: userData, status:response.status };
    };

    // Используем useMutation внутри пользовательского хука
    const { mutateAsync: loginUser, isLoading, error, isSuccess, data, isError } = useMutation(loginMyUserRequest, {
        retry: 0,
        onSuccess: (dataUser) => {
            if(dataUser?.status === 201)
                toast.success("You have successfully logged in.");
        },
    });

    // Возвращаем данные хука
    return {
        loginUser,
        isLoading,
        error,
        isSuccess,
        userData: data,
        isError,
    };
};

export const useCreateMyUser = () => {

        const createMyUserRequest = async (user: UserRegistration):
            Promise<{
                user?:UserSession,
                response?: FormErrors | { message: string};
                status:number}> => {
            const response = await fetch(`${API_BASE_URL}/user/registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });


            const responseData = await response.json();

            if(response && response.status && response.status>=500 && response.status<600){
                toast.error(handleServerError({status:response.status}))
            }

            if(isValidJSON(responseData)){
                const parsedData = JSON.parse(responseData)
                if (!(responseData.token) && isFormErrors(parsedData) && response.status >= 400 && response.status < 500) {
                    return {response:parsedData, status:response.status}
                }
            }

            if (responseData && responseData.message && response.status !== 200) {
                return { response: { message: responseData.message}, status:response.status };
            }

            return {user:responseData, status:response.status}
        };

        const {
            mutateAsync: createUser,
            isLoading,
            error,
            isSuccess,
            data: userSession
        } = useMutation(createMyUserRequest, {
            onSuccess: (dataUser) => {
                console.log(dataUser)
                if(dataUser?.status === 201)
                    toast.success("Message has been successfully send");
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
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(PersonalDetailsFormData),
            });


            const responseData = await response.json();

            if(response && response.status && response.status>=500 && response.status<600){
                toast.error(handleServerError({status:response.status}))
            }

            localStorage.setItem('token', responseData as string);
            return jwtDecode<User>(responseData);
        };

        const {
            mutateAsync: updateUser,
            isLoading,
            error,
            isSuccess,
            data: userData
        } = useMutation(updateMyUserRequest, {
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

export const useGetUserInfo = () => {
    const getUserInfoRequest = async (): Promise<UserInfo> => {
        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        return response.json()
    }
    const {data: userInfo, isLoading, error, refetch} = useQuery('fetchMyUserInfo', getUserInfoRequest,
        {retry: 0}
    )
    return {userInfo, isLoading, error, refetch}
}

export const useVerifyEmail = (id: string | undefined) => {
    if (!id) throw new Error('unable to verify email')
    const verifyEmailRequest = async (): Promise<User> => {

        const response = await fetch(`${API_BASE_URL}/user/verify/${id}`, {
            method: "GET"
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        const responseData = await response.json()
        localStorage.setItem('token', responseData.token as string);
        return jwtDecode<User>(responseData.token);
    }
    const {data: userData, isLoading, isError, isSuccess} = useQuery('fetchVerifyEmail', verifyEmailRequest,
        {retry: 0}
    )
    return {userData, isLoading, isError, isSuccess}
}
