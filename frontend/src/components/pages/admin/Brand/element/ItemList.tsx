import {Card, CardContent, CardHeader} from "../../../../ui/card.tsx";
import {Skeleton} from "../../../../ui/skeleton.tsx";
import {Separator} from "../../../../ui/separator.tsx";




export type Item = {
    name:string,
    _id:string,
}

type Props = {
    values: Item[] | undefined,
    isLoading:boolean,
    children:React.ReactNode,
    name:string
}

const ItemList = ({values, isLoading, children, name}:Props) => {
    if(isLoading ){
        return (
            <div className="flex flex-col space-y-4">
                <Card className={'border-gray-400 border rounded h-[120px]'}>

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
        if( Array.isArray(values) && values.length !== 0){
            return (
                <div className={'flex flex-row flex-wrap max-w-[800px]'}>
                    {children}
                </div>
            )
        }
        return(
            <div>
                {`You haven't added any ${name} yet.`}
            </div>
        )

    }
};

export default ItemList;