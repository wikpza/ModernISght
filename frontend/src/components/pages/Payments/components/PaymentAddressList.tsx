import {Address} from "../../../../types.ts";
import {Card, CardContent, CardHeader} from "../../../ui/card.tsx";
import {Skeleton} from "../../../ui/skeleton.tsx";
import {Separator} from "../../../ui/separator.tsx";
import PaymentAddressCart from "./PaymentAddressCart.tsx";


type Props = {
    addresses: Address[] | undefined,
    isLoading:boolean,
    selectedAddress:Address,
    setSelectedAddress:(address:Address)=>void
}

const layout = ({addresses, isLoading, selectedAddress, setSelectedAddress}:Props) => {
    if(isLoading ){
        return (
            <div className="flex flex-col space-y-4">
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
        if( Array.isArray(addresses) && addresses.length !== 0){

            return (
                <div className={'flex flex-col space-y-4'}>
                    {addresses.map((address,index) =>{
                        if(address._id !== selectedAddress._id)  return <PaymentAddressCart key = {index} address={address} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}/>} )
                    }

                </div>
            )
        }
        return(
            <div>
                You haven't added any addresses yet.
            </div>
        )

    }


}
export default layout