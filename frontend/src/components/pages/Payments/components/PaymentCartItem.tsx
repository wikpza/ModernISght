import {Card, CardContent} from "../../../ui/card.tsx";
import { GetCartProductList} from "../../../../types/Cart.type.ts";
import {calculateDiscountedPrice, isDiscountActive} from "../../../../lib/utils.ts";
import {useNavigate} from "react-router-dom";


type Props = {
    product:GetCartProductList
}
const PaymentCartItem = ({product}:Props) => {



    const navigate = useNavigate()

    return (
        <Card className={'max-w-[500px] flex-1 pt-4 min-w-[300px] '}>

            <CardContent className={' gap-4 flex'}>

                <section className={'w-2/5'}
                         onClick={()=>navigate(`/products/${product.product._id}/${product.product.productVariant._id}`)}>
                    <img
                        src={product.product.productVariant.images[0] ? `http://localhost:9003/picture/${product.product.productVariant.images[0]}` : "https://www.mobismea.com/upload/iblock/2a0/2f5hleo…nbv82hxfh4ld/No%20Product%20Image%20Available.png"}
                    />
                </section>

                <section className={'space-y-2 w-3/5'}>

                    <div className={'flex justify-between items-center mb-4'}>
                        <div className={'text-base font-medium font-sans'}>{product.product.name}</div>

                    </div>


                    <div style={{backgroundColor: "#f1f1f1"}} className={'p-1 flex rounded w-full max-h-[60px]'}>
                        <section
                            className={'border border-gray-500 rounded-md px-5 py-2 bg-white w-1/2 flex items-center justify-center cursor-pointer'}>
                            {product?.product.categoryId.name}
                        </section>
                        <section className={'flex items-center justify-center w-1/2 cursor-pointer'}>
                            {product?.product.gender.name}
                        </section>
                    </div>
                    {product.product.productVariant.discountInfo && isDiscountActive(product.product.productVariant.discountInfo) ?

                        <section className={'text-base  mt-3'}>
                            <span className={'line-through text-gray-500 mr-3'}>${product.product.productVariant.price}</span>
                            <span
                                className={'mr-3'}>${calculateDiscountedPrice(product.product.productVariant.price, product.product.productVariant.discountInfo.percent)}</span>
                            <div>
                                <span
                                    className={'text-yellow-600 mr-3'}>{product.product.productVariant.discountInfo.name}</span>
                                <span
                                    className={'text-yellow-600'}>{product.product.productVariant.discountInfo.percent}% off</span>
                            </div>

                        </section>
                        :
                        <section className={'text-base  mt-3'}>
                            {product.product.productVariant.price ?
                                `$${product.product.productVariant.price}` : "haven't added product Variant"
                            }

                        </section>
                    }

                    <div className={'text-sm'}>color : <span>{product.product.productVariant.colorId.name}</span></div>
                    <div className={'text-sm font-sans'}>size : <span>{product.size.name}</span></div>

                    {product.inventoryQuantity === 0 ?
                        <div className={'text-red-700'}>This item is out of stock at the moment. </div>
                        :
                        <div className={'text-sm '}>quantity : {product.quantity}

                        </div>
                    }


                </section>


            </CardContent>
        </Card>
    );
};

export default PaymentCartItem;