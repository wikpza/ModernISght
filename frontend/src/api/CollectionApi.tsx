import { Collection} from "../types.ts";
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetCollections = ()=>{
    const getCollectionsRequest = async():Promise<Collection[]>=>{

        const response = await fetch(`${API_BASE_URL}/product/collection`,{
            method:"GET",

        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:collections, isLoading, error} = useQuery('fetchCollections',getCollectionsRequest,
        {retry:1}
    )
    return {collections, isLoading, error}
}

export const useDeleteCollection = () =>{

    const deleteCollectionRequest = async(id:string):Promise<Collection[]> =>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/collection/${id}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"}
            })
        if(!response.ok){
            throw new Error("Failed to delete collection")
        }
        return response.json()
    }

    const {mutate:deleteCollection, isLoading, isSuccess, error} = useMutation(deleteCollectionRequest, {
        retry:0,

    })

    return {deleteCollection, isLoading, error, isSuccess}
}
export const useCreateCollection = ()=>{

    const createCollectionRequest = async(collection:Collection):Promise<Collection>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/collection`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(collection)
            })


        if(!response.ok) toast.error(await response.json())



        return response.json()
    }

    const {mutate:createCollection, isLoading, isSuccess, error} = useMutation(createCollectionRequest, {
        retry:0
    })

    return {createCollection, isLoading, error, isSuccess}
}
export const useUpdateCollection = ()=>{
    let hasErrorBeenShown = false;

    const accessToken = localStorage.getItem('token');
    const updateCollectionRequest = async(collection:Collection):Promise<Collection>=>{
        const response = await fetch(`${API_BASE_URL}/product/collection/${collection._id}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(collection)
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData);
        }
        return response.json()
    }

    const {
        mutateAsync:updateCollection,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateCollection", updateCollectionRequest, {
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
        updateCollection,
        isLoading,
        error,
        isSuccess
    }

}
