import {useDeleteCard} from "../../../../api/CardAPI.tsx";

type Props = {
    cvv: string;
    cardNumber: string;
    expiryDate: string;
    cardId:string
};

const CardItem = ({ cvv, cardNumber, expiryDate, cardId }: Props) => {
    // Форматируем номер карты для отображения (маскируем)
    const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");

    const {deleteCard, isSuccess} = useDeleteCard()
     // Разделяем дату на месяц и го
    const [month, year] = expiryDate.split("/");

    if(isSuccess) window.location.reload()
    return (
        <div className="w-full max-w-[400px] min-w-[300px] rounded-lg shadow-lg overflow-hidden border-gray-400 border ">
            {/* Карточка Header */}
            <div className="p-4">
                <h2 className="text-xl font-medium">Card Information</h2>
            </div>

            {/* Карточка Body */}
            <div className="p-4 space-y-2">
                {/* Номер карты */}
                <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                        <p className="text-lg font-normal">Card Number</p>
                        <p className="text-base mt-1">{formattedCardNumber}</p>
                    </div>
                </div>

                {/* CVV */}
                <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                        <p className="text-lg font-medium">CVV</p>
                        <p className="text-base mt-1">{cvv}</p>
                    </div>
                </div>

                {/* Expiry Date */}
                <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                        <p className="text-lg font-medium">Expiry Date</p>
                        <p className="text-base mt-1">{month}/{year}</p>
                    </div>
                </div>
            </div>

            {/* Карточка Footer */}
            <div className="bg-gray-300 text-center py-2 ">

                <div className="mt-4 flex justify-center space-x-4">

                    <button
                        className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition"
                        onClick={() => deleteCard(cardId)}
                    >
                        Delete
                    </button>
                </div>
            </div>


        </div>
    );
};

export default CardItem;
