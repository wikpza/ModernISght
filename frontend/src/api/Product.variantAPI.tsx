import {GetProductElement, Product} from "../types/product.type.ts";
import {toast} from "sonner";
import {useMutation, useQuery} from "react-query";
import {CreateProductVariant} from "../types.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useCreateProductVariant = () => {
    const accessToken = localStorage.getItem('token');

    const addProductVariantRequest = async (input: { variant: CreateProductVariant, id: string }): Promise<Product> => {
        const formData = new FormData();

        // Добавьте текстовые поля
        formData.append('price', input.variant.price.toString());
        formData.append('colorId', input.variant.color._id);
        formData.append('available', input.variant.available.toString());
        formData.append('active', input.variant.active.toString());

        // Если у вас есть изображения, добавьте их как файлы
        input.variant.images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await fetch(`${API_BASE_URL}/product/variant/${input.id}/variant/add`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // Не нужно явно указывать Content-Type при использовании FormData
            },
            body: formData
        });

        if (!response.ok) {
            toast.error(await response.json());
        }

        return response.json();
    };

    const {
        mutateAsync: addProduct,
        isLoading,
        error,
        isSuccess
    } = useMutation("CreateVariant", addProductVariantRequest, {
        retry: 0,
        onSuccess: () => {
            toast.success('Product variant successfully added');
        },
    });

    return {
        addProduct,
        isLoading,
        error,
        isSuccess
    };
};
export const useDeletePictureProductVariant = () => {
    const accessToken = localStorage.getItem('token');

    const deletePictureProductVariantRequest = async (input:{productId:string,variantId:string,images:string[]}): Promise<Product> => {


        const response = await fetch(`${API_BASE_URL}/product/variant/${input.productId}/variant/picture/${input.variantId}`, {
            method: "DELETE",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({images:input.images})
        });

        if (!response.ok) {
            toast.error(await response.json());
        }

        return response.json();
    };

    const {
        mutateAsync: deletePicture,
        isLoading,
        error,
        isSuccess
    } = useMutation("DeletePictureVariant", deletePictureProductVariantRequest, {
        retry: 0,
        onSuccess: () => {
            toast.success('pictures successfully updated');
        },
    });

    return {
        deletePicture,
        isLoading,
        error,
        isSuccess
    };
};
export const useGetProductVariant = (input:{productId:string, variantId:string}) => {
    const getProductByIdRequest = async (): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/product/variant/${input.productId}/variant/${input.variantId}`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json();
    };

    const { data: product, isLoading, error } = useQuery<Product, Error>(
        ['fetchProductVariant', input.variantId],  // используем id как часть ключа
        getProductByIdRequest,      // передаем саму функцию запроса
        { retry: 1 }
    );

    return { product, isLoading, error };
};
export const useUpdateProductVariant = () => {
    const accessToken = localStorage.getItem('token');

    const updateProductVariantRequest = async (input: { variant: CreateProductVariant, productId: string, variantId:string }): Promise<Product> => {
        const formData = new FormData();

        // Добавьте текстовые поля
        formData.append('price', input.variant.price.toString());
        formData.append('colorId', input.variant.color._id);
        formData.append('available', input.variant.available.toString());
        formData.append('active', input.variant.active.toString());

        // Если у вас есть изображения, добавьте их как файлы
        input.variant.images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await fetch(`${API_BASE_URL}/product/variant/${input.productId}/variant/${input.variantId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,

            },
            body: formData
        });

        if (!response.ok) {
            toast.error(await response.json());
        }

        return response.json();
    };

    const {
        mutateAsync: updateProduct,
        isLoading,
        error,
        isSuccess
    } = useMutation("UpdateVariant", updateProductVariantRequest, {
        retry: 0,
        onSuccess: () => {
            toast.success('Product variant successfully added');
        },
    });

    return {
        updateProduct,
        isLoading,
        error,
        isSuccess
    };
};
export const useGetProductVariantElement = (input:{productId:string, variantId:string}) => {
    const getProductElementByIdRequest = async (): Promise<GetProductElement> => {
        const response = await fetch(`${API_BASE_URL}/product/variant/${input.productId}/variant/id/${input.variantId}`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json();
    };

    const { data: product, isLoading, error, isSuccess, refetch } = useQuery<GetProductElement, Error>(
        ['fetchProductVariantElement', input.variantId],  // используем id как часть ключа
        getProductElementByIdRequest,      // передаем саму функцию запроса
        { retry: 1 }
    );

    return { product, isLoading, error, isSuccess, refetch};
};