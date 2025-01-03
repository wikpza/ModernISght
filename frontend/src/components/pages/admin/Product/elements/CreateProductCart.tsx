import {Card, CardContent} from "../../../../ui/card.tsx";
import ProductForm from "../../../../forms/CreateProductForm.tsx";


const CreateProductCart = () => {



    return (
        <Card className={'border-gray-400 border rounded max-w-[600px] flex-row m-2 flex-1  min-w-[320px] min-h-[250px]'}>

            <CardContent className={'text-base text-black py-5 flex-1 h-full '}>

                <ProductForm/>

            </CardContent>
        </Card>
    );
};

export default CreateProductCart;