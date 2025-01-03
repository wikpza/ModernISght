
import {Card, CardContent} from "../../../../ui/card.tsx";

import SizeForm from "../../../../forms/SizeForm.tsx";



const CreateSizesCart = () => {



    return (
        <Card className={'border-gray-400 border rounded max-w-[600px] flex-row m-2 flex-1  min-w-[320px] min-h-[250px]'}>

            <CardContent className={'text-base text-black py-5 flex-1 h-full '}>

                <SizeForm/>

            </CardContent>
        </Card>
    );
};

export default CreateSizesCart;