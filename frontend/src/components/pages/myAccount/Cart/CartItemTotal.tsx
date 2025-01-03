import {GetCart} from "../../../../types/Cart.type.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../../ui/table.tsx";
import {Separator} from "../../../ui/separator.tsx";
import CustomButton from "../../../ui/CustomButton.tsx";
import {useNavigate} from "react-router-dom";
import {calculateDiscountedPrice, isDiscountActive, roundToTwoDecimalPlaces} from "../../../../lib/utils.ts";

type Props = {
    cart:GetCart | undefined
}

const CartItemTotal = ({cart}:Props) => {
    const navigate = useNavigate()
    let totalPrice = 0
    if(!cart){
        return (
            <div></div>)

    }

    return (
        <div className={'bg-gray-100 p-3 max-w-[600px] rounded mt-5'}>
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
                    {cart.productList.map((product, index)=>{

                        if(product.quantity <= product.inventoryQuantity){
                            if(product.product.productVariant.discountInfo && isDiscountActive(product.product.productVariant.discountInfo)){
                                totalPrice = totalPrice + roundToTwoDecimalPlaces(calculateDiscountedPrice(product.product.productVariant.price, product.product.productVariant.discountInfo?.percent) * product.quantity)
                            }
                            else{
                                totalPrice = totalPrice + roundToTwoDecimalPlaces(product.product.productVariant.price * product.quantity)
                            }
                            return (
                                <TableRow key = {index} className={'text-black'}>
                                    <TableCell className="font-medium font-sans">{product.product.name}</TableCell>
                                    <TableCell  className={'text-center '} >{product.size.name}</TableCell>
                                    <TableCell className={'text-center'} >{product.quantity}</TableCell>
                                    <TableCell className=" text-right" >${product.product.productVariant.discountInfo && isDiscountActive(product.product.productVariant.discountInfo)? calculateDiscountedPrice(product.product.productVariant.price, product.product.productVariant.discountInfo.percent) :product.product.productVariant.price}</TableCell>
                                    <TableCell className=" text-right">${product.product.productVariant.discountInfo && isDiscountActive(product.product.productVariant.discountInfo)? calculateDiscountedPrice(product.product.productVariant.price, product.product.productVariant.discountInfo.percent)*product.quantity :product.product.productVariant.price*product.quantity}</TableCell>
                                </TableRow>
                            )
                        }
                    })}
                </TableBody>
            </Table>
            <Separator className={'bg-gray-400 h-[1px] w-full mb-8'}/>

            <section className={'flex justify-between text-black text-lg mb-5'}>
                <div>Order Total</div>
                <div>${totalPrice}</div>
            </section>

            <div onClick={()=>navigate('/payment')}>
                <CustomButton className={'w-full h-[60px] '}>Checkout</CustomButton>
            </div>


        </div>
    );
};

export default CartItemTotal;