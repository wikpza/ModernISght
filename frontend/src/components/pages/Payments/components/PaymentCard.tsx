
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../ui/card.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../ui/accordion.tsx";
import CustomButton from "../../../ui/CustomButton.tsx";
import {useNavigate} from "react-router-dom";
import {getCard, getCards} from "../../../../types/Card.type.ts";
import PaymentCardItem from "./PaymentCardItem.tsx";
import PaymentCardList from "./PaymentCardList.tsx";


type Props = {
    cards: getCards | undefined,
    isLoading:boolean,
    selectedCard:getCard,
    setSelectedCard:(address:getCard)=>void,
}
const PaymentShipping = ({cards, selectedCard, setSelectedCard, isLoading}:Props) => {


    const navigate = useNavigate()
    return (
        <div>
            <Card className={'m-5 border-gray-500 bg-gray-100'}>
                <CardHeader>
                    <CardTitle className={'text-black text-2xl'}>Card</CardTitle>

                    <CardDescription>Choose the card</CardDescription>
                </CardHeader>
                <CardContent>

                    <PaymentCardItem cvv={selectedCard.cvv}
                        cardNumber={selectedCard.number}
                        expiryDate={selectedCard.expiryDate}
                        cardId={selectedCard._id}
                        setSelectedCard={setSelectedCard}
                        selectedCard={selectedCard}
                    />

                    {cards && cards.cards?.length > 1 &&
                        <Accordion type="single" collapsible className={'border-gray-500 border rounded p-3 mt-3 bg-white'}>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Select Another Address</AccordionTrigger>
                                <AccordionContent>
                                    <PaymentCardList cards={cards} isLoading={isLoading} setSelectedCard={setSelectedCard} selectedCard={selectedCard} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    }



                        <div onClick={()=>navigate("/account/payments")} className={'mt-5'}>
                            <CustomButton className={'w-full max-w-[200px] h-[50px]'}>Add Card</CustomButton>
                        </div>



                </CardContent>


            </Card>
        </div>
    );
};

export default PaymentShipping;