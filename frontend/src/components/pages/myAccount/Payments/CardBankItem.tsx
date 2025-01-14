
import "./cardBank.css"
import {useDeleteCard} from "../../../../api/CardAPI.tsx";
import {Card} from "@/components/ui/card.tsx";
import {CreditCard} from "lucide-react";
import {useContext, useEffect} from "react";
import {Context} from "@/main.tsx";
import {GoTrash} from "react-icons/go";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {getCards} from "@/types/Card.type.ts";
import {observer} from "mobx-react-lite";
type Props = {
    cvv: string;
    cardNumber: string;
    expiryDate: string;
    cardId:string
    refetch: <TPageData>(options?: ((RefetchOptions & RefetchQueryFilters<TPageData>) | undefined)) => Promise<QueryObserverResult<getCards, Error>>
};

const CardBankItem = observer( ({  cardNumber, expiryDate, cardId, refetch }: Props) => {

    const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");

    const {user} = useContext(Context)
    const {deleteCard, isSuccess} = useDeleteCard()


    useEffect(() => {
        refetch()
    }, [isSuccess]);

    return (
        <Card  className="relative overflow-hidden group bg-white border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 max-w-[400px] w-full min-w-[300px]">
            <div className="absolute inset-0 bg-white transition-transform duration-300 group-hover:scale-[1.02]" />

            <div className="relative p-6 text-gray-800">
                <div className="flex justify-between items-start mb-8">
                    <CreditCard className="w-10 h-10 text-gray-700" />
                    <span className="text-sm font-medium text-gray-600">
                        <div className={"p-1 border-2 border-black rounded"}>
                            <GoTrash onClick={()=>deleteCard(cardId)} className={'text-2xl'}/>
                        </div>

                  </span>
                </div>

                <div className="space-y-6">
                    <div className="text-xl tracking-wider text-gray-900">{formattedCardNumber}</div>

                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">Card Holder</p>
                            <p className="text-sm font-medium text-gray-700">{`${user.user.firstName} ${user.user.lastName}`}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">Expires</p>
                            <p className="text-sm font-medium text-gray-700 font-sans">{expiryDate}</p>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
})


export default CardBankItem;