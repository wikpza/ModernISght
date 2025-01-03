
import {useNavigate} from "react-router-dom";
import {GetProductUser, GetProductVariant} from "../../../../types/product.type.ts";
import {useEffect, useState} from "react";
import {Carousel, CarouselNext, CarouselPrevious, CarouselContent, CarouselItem,} from "../../../ui/carousel.tsx";
import {calculateDiscountedPrice, isDiscountActive} from "../../../../lib/utils.ts";


const ProductViewCart = ({ product }:
                         { product: GetProductUser }) => {

    const [selectedProduct, setSelectedProduct] = useState<GetProductVariant>(
        product.productVariant[0] || {}
    );


    const navigate = useNavigate()
    const [imageUrl, setImageUrl] = useState("https://www.mobismea.com/upload/iblock/2a0/2f5hleoupzrnz9o3b8elnbv82hxfh4ld/No%20Product%20Image%20Available.png");


    useEffect(() => {
        if (selectedProduct && selectedProduct.images && selectedProduct.images.length !== 0) {
            setImageUrl(`http://localhost:9003/picture/${selectedProduct.images[0]}`);
        }
    }, [selectedProduct]);

    useEffect(() => {
       setSelectedProduct(product.productVariant[0] || {})
    }, [product]); // Зависимость от `product`

    const handleMouseEnter = () => {
        if (selectedProduct.images.length >= 2) {
            setImageUrl(`http://localhost:9003/picture/${selectedProduct.images[1]}`); // Используем второй элемент в списке изображений
        }
    };
    const handleMouseLeave = () => {
        if (selectedProduct.images.length !== 0) {
            setImageUrl(`http://localhost:9003/picture/${selectedProduct.images[0]}`); // Возвращаем на первое изображение
        }
    };


    return (
        <div className= {`rounded  h-fit flex-row m-2 space-y-2 ${product.productVariant.length === 0? "h-fit":"h-fit"}`} >

            <section className=" relative w-auto h-full flex justify-center align-middle overflow-hidden product-cart ">
                <img
                    src={imageUrl}
                    alt={product.name}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={()=>navigate(`/products/${product._id || ""}/${selectedProduct._id || ""}`)}
                />

            </section>

            <div className={'flex-row  space-y-2 align-bottom'}>
                {
                    product.productVariant.length !== 0 &&
                    <section>
                        <div className="max-h-[50px]">
                            {product.productVariant.length > 3 ?
                                <Carousel
                                    opts={{
                                        align: "start",
                                    }}
                                    className="w-full max-w-sm flex flex-1 box-carousel_box ">

                                    <div className={'Button-box  Button-box-left mr-1.5'}>
                                        <CarouselPrevious style={{position: "relative!important"}}/>
                                    </div>

                                    <CarouselContent className=" ml-0 w-full flex-1 box-content_product "
                                                     style={{display: "flex"}}>


                                        {product.productVariant && product.productVariant.length !== 0 &&
                                            product.productVariant.map((productVariant) => (
                                                <CarouselItem
                                                    key={productVariant._id}
                                                    className={`relative flex justify-center align-middle overflow-hidden max-w-[50px] p-0 mr-2 cursor-pointer ${productVariant._id === selectedProduct._id ? "border border-b border-black" : ""} `}

                                                    onClick={() => setSelectedProduct(productVariant)}
                                                >
                                                    <img
                                                        src={`http://localhost:9003/picture/${productVariant.images[0].replace(
                                                            /\.webp$/,
                                                            "_s.webp"
                                                        )}` || ""}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />


                                                </CarouselItem>

                                            ))}


                                    </CarouselContent>

                                    <div className={'Button-box Button-box-right ml-1.5 '}>

                                        <CarouselNext style={{position: "relative!important"}}/>
                                    </div>
                                </Carousel>
                                :
                                <section
                                    className="w-full max-w-sm flex flex-1 h-[50px] ">

                                    <div className=" ml-0 w-full flex-1 space-x-2" style={{display: "flex"}}>
                                        {product.productVariant.length !== 0 &&
                                            product.productVariant.map((productVariant) => (
                                                <div
                                                    key={productVariant._id}
                                                    className={` flex justify-center align-middl max-w-[50px] p-0 ${productVariant._id === selectedProduct._id ? "border border-b border-black" : ""} `}

                                                    onClick={() => setSelectedProduct(productVariant)}
                                                >
                                                    <img
                                                        src={`http://localhost:9003/picture/${productVariant.images[0].replace(
                                                            /\.webp$/,
                                                            "_s.webp"
                                                        )}` || ""}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                            ))}

                                    </div>


                                </section>
                            }
                        </div>
                    </section>

                }


                <section className={' text-base font-medium font-sans'}>
                    {product.name}
                </section>

                <section className={'py-2 text-sm text-gray-500'}>
                    {`${product.gender.name} / ${product.category.name} / ${product.brand.name}`}
                </section>

                {selectedProduct.discountInfo && isDiscountActive(selectedProduct.discountInfo) ?

                    <section className={'text-base  mt-3'}>
                        <span className={'line-through text-gray-500 mr-3'}>${selectedProduct.price}</span>
                        <span
                            className={'mr-3'}>${calculateDiscountedPrice(selectedProduct.price, selectedProduct.discountInfo.percent)}</span>
                        <span className={'text-yellow-600 mr-3'}>{selectedProduct.discountInfo.name}</span>
                        <span className={'text-yellow-600'}>{selectedProduct.discountInfo.percent}% off</span>
                    </section>
                    :
                    <section className={'text-base  mt-3'}>
                        {selectedProduct.price ?
                            `$${selectedProduct.price}` : "haven't added product Variant"
                        }

                    </section>
                }


            </div>

        </div>
    );
};

export default ProductViewCart;
