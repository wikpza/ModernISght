import {GetCart} from "../../../../types/Cart.type.ts";
import {Card, CardContent, CardHeader} from "../../../ui/card.tsx";
import {Skeleton} from "../../../ui/skeleton.tsx";
import {Separator} from "../../../ui/separator.tsx";
import PaymentCartItem from "./PaymentCartItem.tsx";

type Props = {
    cart: GetCart | undefined,
    isLoading:boolean
}

const PaymentCart = ({cart, isLoading}:Props) => {
    if(isLoading ){
        return (
            <div className="flex flex-col space-y-4 w-full">
                <Card className={'border-gray-400 border rounded h-[180px]'}>

                    <CardHeader className={'w-fit pb-4'}>
                        <Skeleton className="h-4 w-[150px] "/>

                    </CardHeader>
                    <Separator className={'w-[90%] bg-gray-400 mx-auto h-[1px] mb-5'}/>

                    <CardContent className={'text-sm text-gray-700 space-y-2'}>

                        <Skeleton className="h-4 w-[100px]"/>
                        <Skeleton className="h-4 w-[70%] min-w=[150px]"/>
                        <Skeleton className="h-4 w-[50%] min-w=[150px]"/>
                    </CardContent>

                </Card>

                <Card className={'border-gray-400 border rounded h-[180px]'}>

                    <CardHeader className={'w-fit pb-4'}>
                        <Skeleton className="h-4 w-[150px] "/>

                    </CardHeader>
                    <Separator className={'w-[90%] bg-gray-400 mx-auto h-[1px] mb-5'}/>

                    <CardContent className={'text-sm text-gray-700 space-y-2'}>

                        <Skeleton className="h-4 w-[100px]"/>
                        <Skeleton className="h-4 w-[70%] min-w=[150px]"/>
                        <Skeleton className="h-4 w-[50%] min-w=[150px]"/>
                    </CardContent>

                </Card>

            </div>
        )
    }else{
        if( cart && cart?.productList.length !== 0){
            return (
                <div className={'flex w-full flex-wrap gap-2 p-5'}>
                    {cart?.productList.map((product, index) => {
                        if(product.inventoryQuantity >= product.quantity){
                            return <PaymentCartItem key = {index} product={product}/>
                        }
                    })}
                </div>
            )
        }
        return(
            <div>
                You haven't added any product yet.
            </div>
        )
    }

};

export default PaymentCart;