import {Card, CardContent, CardHeader} from "../../../../ui/card.tsx";
import {Skeleton} from "../../../../ui/skeleton.tsx";
import {Separator} from "../../../../ui/separator.tsx";
import {Product} from "../../../../../types/product.type.ts";




type Props = {
    values: Product[],
    isLoading:boolean,
    children:React.ReactNode,
    name:string,
    addProduct:boolean
}

const ProductList = ({values, isLoading, children, name, addProduct}:Props) => {
    if(isLoading ){
        return (
            <div className="flex flex-col  space-y-4 ">
                <Card className={'border-gray-400 border rounded  '}>

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
        if( (Array.isArray(values) && values.length !== 0) || addProduct){
            return (
                <div className={'ProductList grid sm:grid-cols-2 gap-4 xl:grid-cols-3 justify-center items-stretch'}>
                    {children}
                </div>
            )
        }
        return (
            <div>
                {`You haven't added any ${name} yet.`}
            </div>
        )

    }
};

export default ProductList;