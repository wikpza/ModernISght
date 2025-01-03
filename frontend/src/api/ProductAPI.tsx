
import {useMutation, useQuery} from "react-query";
import {toast} from "sonner";
import {CreateProduct, GetProductUser, Product, UpdateProduct} from "../types/product.type.ts";
import {ParamsSearch} from "../components/pages/Product/component/ProductView.tsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetProducts = ()=>{
    const getProductsRequest = async():Promise<Product[]>=>{
        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/prod/admin`,{
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
    const {data:products, isLoading, error} = useQuery('fetchProduct',getProductsRequest,
        {retry:1}
    )
    return {products, isLoading, error}
}
export const useUpdateProduct = ()=>{
    let hasErrorBeenShown = false;

    const accessToken = localStorage.getItem('token');
    const updateProductRequest = async({product, id}:{product:UpdateProduct, id:string}):Promise<Product>=>{
        const featuresDictionary = product.features.reduce<Record<string, string>>((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {});

        const response = await fetch(`${API_BASE_URL}/product/prod/${id}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {
                    name:product.name,
                    collectionId:product.collection._id,
                    brandId:product.brand._id,
                    active:product.active,
                    features:featuresDictionary
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:updateProduct,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateProduct", updateProductRequest, {
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
        updateProduct,
        isLoading,
        error,
        isSuccess
    }

}
export const useCreateProduct = ()=>{

    const accessToken = localStorage.getItem('token');
    const creaetProductRequest = async(product:CreateProduct):Promise<Product>=>{

        const featuresDictionary = product.features.reduce<Record<string, string>>((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {});

        const response = await fetch(`${API_BASE_URL}/product/prod`,{
            method:"POST",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body:JSON.stringify(
                {name:product.name,
                    genderId:product.gender._id,
                    collectionId:product.collection._id,
                    categoryId:product.category._id,
                    brandId:product.brand._id,
                    active:product.active,
                    features:featuresDictionary
                }
            )
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:createProduct,
        isLoading,
        error,
        isSuccess
    } = useMutation("CreateProduct", creaetProductRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('product successfully created');
        },
    })


    return {
        createProduct,
        isLoading,
        error,
        isSuccess
    }

}
export const useDeleteProduct = ()=>{

    const accessToken = localStorage.getItem('token');
    const deleteProductRequest = async(id:string):Promise<Product>=>{


        const response = await fetch(`${API_BASE_URL}/product/prod/${id}`,{
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }
        })
        if(!response.ok) toast.error(await response.json())
        return response.json()
    }

    const {
        mutateAsync:deleteProduct,
        isLoading,
        error,
        isSuccess
    } = useMutation("DeleteProduct", deleteProductRequest, {
        retry:0,
        onSuccess: () => {
            toast.success('product successfully deleted');
        },
    })


    return {
        deleteProduct,
        isLoading,
        error,
        isSuccess
    }

}
export const useGetProductById = (id: string) => {
    const getProductByIdRequest = async (): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/product/prod/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json();
    };

    const { data: product, isLoading, error } = useQuery<Product, Error>(
        ['fetchProductById', id],  // используем id как часть ключа
        getProductByIdRequest,      // передаем саму функцию запроса
        { retry: 1 }
    );

    return { product, isLoading, error };
};
export const getProductsRequest = (params: ParamsSearch)=>{
    return    async (): Promise<GetProductUser[]> => {
        // Преобразуем параметры в строку запроса
        const queryString = new URLSearchParams({
            colors: JSON.stringify(params.colors.map(item => item._id)),
            brands: JSON.stringify(params.brands.map(item => item._id)),
            collections: JSON.stringify(params.collections.map(item => item._id)),
            gender: JSON.stringify(params.genders.map(item => item._id)),
            categories: JSON.stringify(params.categories.map(item => item._id)),

            sortBy: params.sortBy, // Исправлено на правильное имя
            sortType: params.sortType.toString(), // Преобразуем в строку
            priceLess: params.priceLess.toString(), // Преобразуем в строку
            priceMore: params.priceMore.toString(), // Преобразуем в строку
            page: params.page.toString(), // Преобразуем в строку
            limit: params.limit.toString() // Преобразуем в строку
        }).toString();

        const response = await fetch(`${API_BASE_URL}/product/prod?${queryString}`, {
            method: "GET",
        });

        if (!response.ok) {
            // Обрабатываем ошибку
            const errorData = await response.json();
            throw new Error(errorData?.message || 'Failed to fetch products');
        }
        return response.json();
    };
}
export const useGetProductsUser = (params: ParamsSearch) => {


    const { data: products, isLoading, error } = useQuery('fetchProductList', getProductsRequest(params), {
        retry: 1,
    });

    return { products, isLoading, error };
};
export const getRandomProductsRequest = (params: {gender:string, category:string})=>{
    return    async (): Promise<GetProductUser[]> => {
        // Преобразуем параметры в строку запроса
        const queryString = new URLSearchParams({
            gender: params.gender, // Преобразуем в строку
            category: params.category // Преобразуем в строку
        }).toString();

        const response = await fetch(`${API_BASE_URL}/product/prod/random?${queryString}`, {
            method: "GET",
        });

        if (!response.ok) {
            // Обрабатываем ошибку
            const errorData = await response.json();
            throw new Error(errorData?.message || 'Failed to fetch products');
        }
        return response.json();
    };
}
export const useGetRandomProductsUser = (params: {gender:string, category:string}) => {


    const { data: products, isLoading, error, refetch } = useQuery('fetchRandomProductList', getRandomProductsRequest(params), {
        retry: 1,
    });

    return { products, isLoading, error, refetch };
};
