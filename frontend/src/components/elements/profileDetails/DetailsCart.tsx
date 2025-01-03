import {Card, CardContent, CardFooter} from "../../ui/card.tsx";
import React from "react";
import {Separator} from "../../ui/separator.tsx";
type Props = {
    title:string,
    value:string,
    isPassword:boolean,
    editButton: React.ReactNode
}
const DetailsCart = ({title, value, isPassword = false, editButton}:Props) => {
    return (
            <Card className={'border-gray-400 border rounded w-full '}>
                <CardContent className={'text-sm text-gray-700 space-y-1 mt-5 pb-1'}>
                    <div className={'text-xl font-medium'}>
                        {title}
                    </div>
                </CardContent>
                <Separator className={'w-[90%] bg-gray-400 mx-auto h-[1px] mb-5'}/>
                <CardFooter>
                    <section className={' text-sm space-y-3'}>
                        {isPassword ?
                            <div className={'text-sm'}>⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫</div>
                            :
                            <div>{value}</div>
                        }

                        {editButton}
                    </section>
                </CardFooter>
            </Card>
    );
}

export default DetailsCart;