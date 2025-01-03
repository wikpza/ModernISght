import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductPersonalForm from "./ProductPersonalForm.tsx";
import { Card } from "../../ui/card.tsx";
import { MdError } from "react-icons/md";
import { useGetProductVariantElement } from "../../../api/Product.variantAPI.tsx";
import { useGetProductInventoryUser } from "../../../api/InventoryApi.tsx";

const ProductPersonalPage = () => {
    const { productId, variantId } = useParams<{ productId: string, variantId: string }>();

    const { product, isLoading, error, isSuccess, refetch } = useGetProductVariantElement({
        productId: productId || "",
        variantId: variantId || ""
    });

    const { productInventory, isLoading: isInventoryLoading, error: inventoryError, refetch: refetchInventory } = useGetProductInventoryUser(variantId || "");

    let indexElement = 0;

    useEffect(() => {
        // При изменении параметров URL запрашиваем новые данные
        refetch();
        refetchInventory();
    }, [productId, variantId, refetch, refetchInventory]);

    if (isLoading || isInventoryLoading) {
        return <div>Loading...</div>;
    }

    if (isSuccess && !isLoading && product) {
        indexElement = product.productVariant.findIndex((variant) => variant._id === variantId);
    }

    if (error || !product || !productInventory || inventoryError) {
        return (
            <div className={'w-full h-full flex justify-center items-center mt-10'}>
                <Card className={'flex flex-col justify-center items-center p-5'}>
                    <MdError className={'text-9xl text-red-500'}/>
                    <div className={'text-base'}>Unable to load product</div>
                </Card>
            </div>
        );
    }

    return (
        <div key={`${productId}-${variantId}`}>
            <ProductPersonalForm
                product={product}
                indexElement={indexElement === -1 ? 0 : indexElement}
                productInventory={productInventory}
            />
        </div>
    );
};

export default ProductPersonalPage;
