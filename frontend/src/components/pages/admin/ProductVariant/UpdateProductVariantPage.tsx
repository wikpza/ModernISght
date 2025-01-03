import { useParams } from "react-router-dom";
import {MdError} from "react-icons/md";
import {Card} from "../../../ui/card.tsx";
import {useGetColors} from "../../../../api/ColorApi.tsx";
import {useGetProductVariant} from "../../../../api/Product.variantAPI.tsx";
import UpdateProductVariantForm from "./UpdateProductVariantForm.tsx";



const UpdateProductVariantPage = () => {
    const { productId, variantId } = useParams<{ productId: string, variantId:string }>();
    const { product, isLoading, error } = useGetProductVariant({productId:productId || "", variantId:variantId || ""});
    const {colors} = useGetColors()

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !product ) {
        return (
            <div className={'w-full h-full flex justify-center items-center mt-10'}>
                <Card className={'flex flex-col justify-center items-center p-5'}>
                    <MdError className={'text-9xl text-red-500'}/>
                    <div className={'text-base'}>Unable to load product</div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <UpdateProductVariantForm product={product} colors={colors} />
        </div>
    );
};

export default UpdateProductVariantPage;
