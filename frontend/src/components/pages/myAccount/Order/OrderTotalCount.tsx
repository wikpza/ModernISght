import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../ui/table.tsx";
import {Separator} from "../../../ui/separator.tsx";
import {Card, CardContent, CardFooter} from "../../../ui/card.tsx";
import {roundToTwoDecimalPlaces} from "../../../../lib/utils.ts";
import {GetPaymentProductList} from "../../../../types/payments.type.ts";

type Props = {
    payment:GetPaymentProductList | undefined,
}

const OrderTotalPrice = ({payment}:Props) => {


    if(payment &&  payment?.purchases.length === 0){
        return (
            <div>
                you haven't bought anything
            </div>
        )
    }
    return (
        <Card className={'m-5 border-gray-500 bg-gray-100 max-w-[600px]'}>
            <div className={'bg-gray-100 p-3  rounded mt-5'}>
                <div className={'text-2xl mb-2'}>Order Summary</div>
                <div>secret key : {payment?.key}</div>
                <Separator className={'bg-gray-400 h-[1px] w-full mt-5'}/>

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
                        {payment?.purchases && payment.purchases.map((product, index) => {

                                return (
                                    <TableRow key={index} className={'text-black'}>
                                        <TableCell className="font-medium font-sans">{product.product.name}</TableCell>
                                        <TableCell className={'text-center '}>{product.size.name}</TableCell>
                                        <TableCell className={'text-center'}>{product.quantity}</TableCell>
                                        <TableCell
                                            className=" text-right">${product.product.productVariant.price}</TableCell>
                                        <TableCell
                                            className=" text-right">${roundToTwoDecimalPlaces(product.product.productVariant.price * product.quantity)}</TableCell>
                                    </TableRow>
                                )

                        })}
                    </TableBody>
                </Table>
                <Separator className={'bg-gray-400 h-[1px] w-full mb-3'}/>

                <section className={'flex justify-between text-black text-lg '}>
                    <div>Product Total</div>
                    <div>${payment?.productPrice}</div>
                </section>

                <section className={'flex justify-between text-black mb-2'}>
                    <div>Shipping Total</div>
                    <div>${payment?.shippingPrice}</div>
                </section>

                <Separator className={'bg-gray-400 h-[1px] w-full mb-5'}/>
                <section className={'flex justify-between text-black text-lg mb-2'}>
                    <div>Order Total</div>
                    <div>${payment?.totalPrice}</div>
                </section>



                <Separator className={`bg-gray-400 h-[1px] w-full mb-1 `}/>
                <section className={'flex justify-between text-black text-lg mb-2'}>
                    <div>Shipping status</div>
                    <div className={`${payment?.shippingStatus === "self-pickup" || payment?.shippingStatus === "in process"?"text-yellow-500" : "text-green-600"}`}>{payment?.shippingStatus}</div>
                </section>

                <Separator className={`bg-gray-400 h-[1px] w-full mb-1 `}/>
                <section className={`flex justify-between text-black text-lg mb-2`}>
                    <div>status</div>
                    <div className={` ${payment?.status === "succeeded" ?"text-green-600" : "text-red-700"}`} >{payment?.status}</div>
                </section>

                {payment?.address && payment.address?._id && (
                    <Card className={'border-gray-400 border rounded'}>

                        <CardContent className={'text-sm text-gray-700 space-y-2 mt-5'}>
                            <section>
                                {`${payment.address?.firstName} ${payment.address?.lastName}`}
                            </section>

                            <section>
                                {`${payment.address?.addressLine1},  ${payment.address?.addressLine2}, ${payment.address?.city}, ${payment.address?.state}, ${payment.address?.zipCode}`}
                            </section>

                            <section>
                                {`+996 ${payment.address?.phoneNumber}`}
                            </section>

                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                ) }

            </div>
        </Card>
    );
};

export default OrderTotalPrice;