import { useParams } from "react-router-dom";
import { useGetProductById } from "../../../../api/ProductAPI.tsx";
import {MdError} from "react-icons/md";
import {Card} from "../../../ui/card.tsx";
import CreateProductVariantForm from "./CreateProductVariantForm.tsx";
import {useGetColors} from "../../../../api/ColorApi.tsx";



const CreateProductVariantPage = () => {
    const { id } = useParams<{ id: string }>();
    const { product, isLoading, error } = useGetProductById(id ?? "");
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
            <CreateProductVariantForm product={product} colors={colors} />
        </div>
    );
};

export default CreateProductVariantPage;
