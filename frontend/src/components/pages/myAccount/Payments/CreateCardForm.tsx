import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../ui/card.tsx";
import {CreateCard, getCards} from "../../../../types/Card.type.ts";
import {useEffect, useState} from "react";
import {useCreateCard} from "../../../../api/CardAPI.tsx";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";


type Props = {
    refetch: <TPageData>(options?: ((RefetchOptions & RefetchQueryFilters<TPageData>) | undefined)) => Promise<QueryObserverResult<getCards, Error>>

}
const CreateCardForm = ({refetch}:Props) => {

    const {createCard, isSuccess} = useCreateCard()

    const [card, setCard] = useState<CreateCard>({
        number: "",
        cvv: "",
        expiryDate: ""
    });

    const [errors, setErrors] = useState({
        number: "",
        cvv: "",
        expiryDate: ""
    });

    // Регулярные выражения для валидации
    const validateCardNumber = (number: string) => {
        const regex = /^\d{16}$/; // Проверка, что номер состоит из 16 цифр
        return regex.test(number);
    };

    const validateCVV = (cvv: string) => {
        const regex = /^\d{3}$/; // Проверка, что CVV состоит из 3 цифр
        return regex.test(cvv);
    };

    const validateExpiryDate = (expiryDate: string) => {
        const regex = /^(0[1-9]|1[0-2])\/(2[0-9])$/; // Проверка формата MM/YY
        return regex.test(expiryDate);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCard((prevCard) => ({
            ...prevCard,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация данных
        const newErrors: CreateCard = {
            number:"",
            cvv:"",
            expiryDate:""
        };
        if (!validateCardNumber(card.number)) {
            newErrors.number = "Card number must be 16 digits.";
        }
        if (!validateCVV(card.cvv)) {
            newErrors.cvv = "CVV must be 3 digits.";
        }
        if (!validateExpiryDate(card.expiryDate)) {
            newErrors.expiryDate = "Expiry date must be in MM/YY format.";
        }

        setErrors(newErrors);

        // Если ошибок нет, можно отправить данные (например, вызвать API)
        if (newErrors.number === "" &&
            newErrors.cvv === "" &&
            newErrors.expiryDate === "" ) {
            createCard(card)
        }
    };

    useEffect(() => {
        refetch()
    }, [isSuccess]);




    return (
        <Card>
            <CardHeader>
                <CardTitle>Create card</CardTitle>
                <CardDescription>Fill in the details to create a new card.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <section className="space-y-4">
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium">Card Number</label>
                            <input
                                type="text"
                                id="number"
                                name="number"
                                value={card.number}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="1234 5678 1234 5678"
                            />
                            {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                        </div>
                        <div>
                            <label htmlFor="cvv" className="block text-sm font-medium">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={card.cvv}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="123"
                            />
                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                        </div>
                        <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium">Expiry Date</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={card.expiryDate}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                placeholder="MM/YY"
                            />
                            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                        </div>
                    </section>
                </form>
            </CardContent>
            <CardFooter>
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                    Create Card
                </button>
            </CardFooter>
        </Card>
    );
};

export default CreateCardForm;
