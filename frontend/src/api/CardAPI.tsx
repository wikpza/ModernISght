
import {CreateCard, getCards} from "../types/Card.type.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetCards = () => {
    const accessToken = localStorage.getItem('token');
    const getCardsRequest = async (): Promise<getCards> => {
        const response = await fetch(`${API_BASE_URL}/user/cards`, {
            method: "GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json();
    };

    const { data: cards, isLoading, error } = useQuery<getCards, Error>(
        ['fetchCards'],  // используем id как часть ключа
        getCardsRequest,      // передаем саму функцию запроса
        { retry: 1 }
    );

    return { cards, isLoading, error };
};

export const useCreateCard = ()=>{

    const accessToken = localStorage.getItem('token');
    const createCardRequest = async(card:CreateCard):Promise<getCards>=>{

        const response = await fetch(`${API_BASE_URL}/user/cards`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    cvv:card.cvv,
                    expiryDate:card.expiryDate,
                    cardNumber:card.number
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:createCard,
        isLoading,
        error,
        isSuccess
    } = useMutation("CreateCard", createCardRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('card successfully created');
        },
    })


    return {
        createCard,
        isLoading,
        error,
        isSuccess
    }

}

export const useDeleteCard = ()=>{

    const DeleteCardRequest = async(id:string):Promise<getCards>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/user/cards/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                  }
            })


        if(!response.ok) toast.error(await response.json())


        return response.json()
    }

    const {mutate:deleteCard, isLoading, isSuccess, error} = useMutation(DeleteCardRequest, {
        retry:0
    })

    return {deleteCard, isLoading, error, isSuccess}
}