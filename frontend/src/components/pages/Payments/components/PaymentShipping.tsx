import {Address} from "../../../../types.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../../ui/card.tsx";
import CustomCombobox from "../../../elements/ComboboxCustom.tsx";
import PaymentAddressCart from "./PaymentAddressCart.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../ui/accordion.tsx";
import PaymentAddressList from "./PaymentAddressList.tsx";
import {Separator} from "../../../ui/separator.tsx";
import {Item} from "../../admin/Brand/element/ItemList.tsx";
import CustomButton from "../../../ui/CustomButton.tsx";
import {useNavigate} from "react-router-dom";


type Props = {
    addresses: Address[] | undefined,
    isLoading:boolean,
    selectedAddress:Address,
    setSelectedAddress:(address:Address)=>void,
    setShippingOption:(value:Item)=>void,
    shippingOption:Item
}
const PaymentShipping = ({addresses, selectedAddress, setSelectedAddress, setShippingOption, shippingOption, isLoading}:Props) => {
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

    const navigate = useNavigate()
    return (
        <div>
            <Card className={'m-5 border-gray-500 bg-gray-100'}>
                <CardHeader>
                    <CardTitle className={'text-black text-2xl'}>Shipping Address</CardTitle>

                    <CardDescription>Choose the way to ship</CardDescription>
                </CardHeader>
                <CardContent>

                    <CustomCombobox
                        listOfValue={orderListValue}
                        selectedName={shippingOption}
                        setName={setShippingOption}
                        optionName={"Shipping"}
                    />

                    { shippingOption._id === "in process" && selectedAddress &&

                        <div className={'mt-5'}>
                            <PaymentAddressCart address={selectedAddress} setSelectedAddress={setSelectedAddress} selectedAddress={selectedAddress}/>

                            {addresses && addresses?.length > 1 &&
                                <Accordion type="single" collapsible className={'border-gray-500 border rounded p-3 mt-3 bg-white'}>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Select Another Address</AccordionTrigger>
                                        <AccordionContent>
                                            <PaymentAddressList addresses={addresses} isLoading={isLoading} setSelectedAddress={setSelectedAddress} selectedAddress={selectedAddress} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            }


                        </div>
                    }


                    {shippingOption._id === "in process" &&
                        <div onClick={() => navigate("/account/addresses")} className={'mt-5'}>
                            <CustomButton className={'w-full max-w-[200px] h-[50px]'}>Add Address</CustomButton>
                        </div>}


                </CardContent>

                <Separator className={'w-full mt-5 h-[1px] bg-gray-400  '}/>
                {shippingOption._id !== "" &&
                    <CardFooter className={' flex justify-between text-lg pt-5 bg-white'}>
                        <div>
                            Shipping Price
                        </div>

                        <div>
                            {
                                shippingOption._id === "self-pickup"?
                                    "FREE"
                                    :
                                    "5% "
                            }
                        </div>
                    </CardFooter>
                }

            </Card>
        </div>
    );
};

export default PaymentShipping;