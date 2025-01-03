import {Card, CardContent, CardHeader} from "../../../ui/card.tsx";
import {Skeleton} from "../../../ui/skeleton.tsx";
import {Separator} from "../../../ui/separator.tsx";
import {getCard, getCards} from "../../../../types/Card.type.ts";
import PaymentCardItem from "./PaymentCardItem.tsx";



type Props = {
    cards: getCards | undefined,
    isLoading:boolean,
    selectedCard:getCard,
    setSelectedCard:(address:getCard)=>void
}

const layout = ({cards, isLoading, selectedCard, setSelectedCard}:Props) => {
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
        if( Array.isArray(cards?.cards) && cards?.cards.length !== 0){

            return (
                <div className={'flex flex-col space-y-4'}>
                    {cards?.cards.map((card, index) =>{
                        if(card._id !== selectedCard._id)  return <PaymentCardItem key = {index}
                                                                                   cvv={card.cvv}
                                                                                   cardNumber={card.number}
                                                                                   expiryDate={card.expiryDate}
                                                                                   cardId={card._id}
                                                                                   setSelectedCard={setSelectedCard}
                                                                                   selectedCard={selectedCard}
                        />} )
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