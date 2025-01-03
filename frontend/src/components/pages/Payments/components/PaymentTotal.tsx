import {GetCart} from "../../../../types/Cart.type.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../ui/table.tsx";
import {Separator} from "../../../ui/separator.tsx";
import CustomButton from "../../../ui/CustomButton.tsx";
import {Card} from "../../../ui/card.tsx";
import {useCreatePayment} from "../../../../api/PaymentAPI.tsx";
import {getCard} from "../../../../types/Card.type.ts";
import {Address} from "../../../../types.ts";
import {toast} from "sonner";
import { PacmanLoader} from "react-spinners";
import {useNavigate} from "react-router-dom";
import {calculateDiscountedPrice, isDiscountActive, roundToTwoDecimalPlaces} from "../../../../lib/utils.ts";

type Props = {
    cart:GetCart | undefined,
    shippingStatus:string,
    selectedAddress:Address,
    selectedCard:getCard
}

const PaymentTotal = ({selectedCard, selectedAddress, cart, shippingStatus}:Props) => {

    const {createPayment, isLoading, isSuccess} = useCreatePayment()
    const navigate = useNavigate()

    const handler = ()=>{
        if(selectedCard._id === ""){
            toast.error("select the bank Card")
            return
        }

        if(selectedAddress._id === "" && shippingStatus==="in process"){
            toast.error("select the address")
            return
        }
        createPayment(
            {
                cardId:selectedCard._id,
                addressId:selectedAddress._id,
                shippingStatus:shippingStatus,
                status:"succeeded"
            }
        )
    }
    let totalPrice = 0
    let shippingPrice = 0

    if(!cart){
        return (
            <div></div>)

    }

    cart.productList.forEach((product)=>{
        if (product.quantity <= product.inventoryQuantity) {

            if(product.product.productVariant.discountInfo && isDiscountActive(product.product.productVariant.discountInfo)){
                totalPrice = totalPrice + roundToTwoDecimalPlaces(calculateDiscountedPrice(product.product.productVariant.price, product.product.productVariant.discountInfo?.percent) * product.quantity)
            }
            else{
                totalPrice = totalPrice + roundToTwoDecimalPlaces(product.product.productVariant.price * product.quantity)
            }
        }
    })

    if(shippingStatus === 'in process'){
        shippingPrice = roundToTwoDecimalPlaces(5*totalPrice/100)
    }

    if(isSuccess) navigate('/account/orders')
    return (
        <Card className={'m-5 border-gray-500 bg-gray-100 max-w-[600px]'}>


            <div className={'bg-gray-100 p-3  rounded mt-5'}>
                <div className={'text-2xl'}>Order Summary</div>
                <Separator className={'bg-gray-400 h-[1px] w-full mt-8'}/>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">name</TableHead>
                            <TableHead className={'text-center'}>size</TableHead>
                            <TableHead className={'text-center'}>quantity</TableHead>
                            <TableHead className="text-right">price</TableHead>
                            <TableHead className="text-right">sub total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cart.productList.map((product, index) => {

                            if (product.quantity <= product.inventoryQuantity) {
                                return (
                                    <TableRow key={index} className={'text-black'}>
                                        <TableCell className="font-medium font-sans">{product.product.name}</TableCell>
                                        <TableCell className={'text-center '}>{product.size.name}</TableCell>
                                        <TableCell className={'text-center'}>{product.quantity}</TableCell>

                                        <TableCell
                                            className=" text-right">${product.product.productVariant.discountInfo && isDiscountActive(product.product.productVariant.discountInfo)? calculateDiscountedPrice(product.product.productVariant.price, product.product.productVariant.discountInfo.percent) :product.product.productVariant.price}</TableCell>
                                        <TableCell

                                            className=" text-right">${product.product.productVariant.discountInfo && isDiscountActive(product.product.productVariant.discountInfo)? calculateDiscountedPrice(product.product.productVariant.price, product.product.productVariant.discountInfo.percent)*product.quantity :product.product.productVariant.price*product.quantity}</TableCell>
                                    </TableRow>
                                )
                            }
                        })}
                    </TableBody>
                </Table>
                <Separator className={'bg-gray-400 h-[1px] w-full mb-3'}/>

                <section className={'flex justify-between text-black text-base mb-2'}>
                    <div>Product Total</div>
                    <div>${totalPrice}</div>
                </section>

                <section className={'flex justify-between text-black text-base mb-5'}>
                    <div>Shipping Total</div>
                    <div>${shippingPrice}</div>
                </section>

                <Separator className={'bg-gray-400 h-[1px] w-full mb-1'}/>
                <section className={'flex justify-between text-black text-lg mb-2'}>
                    <div>Order Total</div>
                    <div>${shippingPrice + totalPrice}</div>
                </section>


                {isLoading ?
                    <div className={'w-full h-[70px] bg-red-600 flex justify-center items-center align-middle '}>
                        <PacmanLoader className={'!block text-2xl mx-auto'}/>
                    </div>
                    :
                    <div onClick={handler}>
                        <CustomButton className={'w-full h-[60px] '}>Checkout</CustomButton>

                    </div>
                }


            </div>
        </Card>
    );
};

export default PaymentTotal;