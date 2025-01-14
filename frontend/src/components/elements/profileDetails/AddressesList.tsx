import {Address} from "../../../types.ts";
import AddressCart from "./AddressCart.tsx";
import {Skeleton} from "../../ui/skeleton.tsx";
import {Card, CardContent, CardHeader} from "../../ui/card.tsx";
import {Separator} from "../../ui/separator.tsx";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";




type Props = {
    addresses: Address[] | undefined,
    isLoading:boolean,
    refetch: <TPageData>(options?: ((RefetchOptions & RefetchQueryFilters<TPageData>) | undefined)) => Promise<QueryObserverResult<Address[], unknown>>

}

const layout = ({addresses, isLoading, refetch}:Props) => {
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
            addresses.sort((a, b) => Number(b.preferred) - Number(a.preferred))
            return (
                <div className={'flex flex-col space-y-4'}>
                    {addresses.map((address,index) => <AddressCart refetch={refetch} key = {index} address={address}/>)}
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