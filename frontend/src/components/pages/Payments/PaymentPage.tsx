import {  } from "../../../api/CardAPI.tsx";
import { useState, useEffect } from "react";
import { Item } from "../admin/Brand/element/ItemList.tsx";
import { Address } from "../../../types.ts";
import { useGetUserAddresses } from "../../../api/UserAddressesApi.tsx";
import PaymentShipping from "./components/PaymentShipping.tsx";
import {useGetCards} from "../../../api/CardAPI.tsx";
import {getCard} from "../../../types/Card.type.ts";
import PaymentCard from "./components/PaymentCard.tsx";
import PaymentCart from "./components/PaymentCart.tsx";
import PaymentTotal from "./components/PaymentTotal.tsx";
import {useGetCart} from "../../../api/CartAPI.tsx";

const PaymentPage = () => {
    const orderListValue = [
        {
            _id: "self-pickup",
            name: "self pick up"
        },
        {
            _id: "in process",
            name: "shipping"
        }
    ];

    const { cart, isLoading:isCartLoading } = useGetCart();

    const { addresses, isLoading: isAddressesLoading } = useGetUserAddresses();
    const [shippingOption, setShippingOption] = useState<Item>(orderListValue[0]);
    const [selectedAddress, setSelectedAddress] = useState<Address>({
        _id: "",
        lastName: "",
        firstName: "",
        addressLine1: "",
        addressLine2: "",
        phoneNumber: "",
        city: "",
        state: "",
        zipCode: "",
        preferred: false
    });

    const {cards, isLoading:isCardLoading} = useGetCards()
    const [selectedCard, setSelectedCard] = useState<getCard>(
        {
            cvv:"",
            number:"",
            expiryDate:"",
            _id:""
        }
    )

    useEffect(() => {
        if (!isAddressesLoading && addresses) {
            const preferredAddress = addresses.find(address => address.preferred);
            if (preferredAddress) {
                setSelectedAddress(preferredAddress);
            }
            if(cards && cards.cards[0]) setSelectedCard(cards.cards[0])
        }
    }, [isAddressesLoading, addresses]);


    return (
        <div>
            <section>
               <PaymentShipping addresses={addresses} isLoading={isAddressesLoading} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress}  setShippingOption={setShippingOption} shippingOption={shippingOption}/>
            </section>

            <section>
                <PaymentCard cards={cards} isLoading={isCardLoading} selectedCard={selectedCard} setSelectedCard={setSelectedCard}/>
            </section>

            <section>
                <PaymentCart cart={cart} isLoading={isCartLoading}/>
            </section>

            <section>
                <PaymentTotal cart={cart} shippingStatus={shippingOption._id} selectedCard={selectedCard} selectedAddress={selectedAddress}/>
            </section>
        </div>
    );
};

export default PaymentPage;
