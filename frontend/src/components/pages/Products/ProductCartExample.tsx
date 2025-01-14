
import {useState} from "react";
import { ProductVariant} from "../../../types.ts";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../../ui/carousel.tsx";
import {Product} from "../../../types/product.type.ts";
import {IMAGE_NOT_FIND} from "@/lib/utils.ts";

const ProductCart = ({ product }: { product: Product }) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductVariant>(
        product.productVariant[0] || {}
    );



    return (
        <div className="rounded max-w-[400px] h-fit flex-row m-2 space-y-2">

            <section className="w-auto h-full flex justify-center align-middle overflow-hidden">
                <img
                    src={
                        selectedProduct.images.length !== 0
                            ? `http://localhost:9003/picture/${selectedProduct.images[0]}`
                            : "https://www.mobismea.com/upload/iblock/2a0/2f5hleoupzrnz9o3b8elnbv82hxfh4ld/No%20Product%20Image%20Available.png"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </section>


            <section>
                <div className="max-h-[50px]">
                    {product.productVariant.length > 4 ?
                        <Carousel
                            opts={{
                                align: "start",
                            }}
                            className="w-full max-w-sm flex flex-1 box-carousel_box ">

                            <div className={'Button-box  Button-box-left mr-1.5'}>
                                <CarouselPrevious />
                            </div>

                            <CarouselContent className=" ml-0 w-full flex-1 box-content_product flex-1"
                                             style={{display: "flex"}}>
                                {product.productVariant.length !== 0 &&
                                    product.productVariant.map((productVariant) => (
                                        <CarouselItem
                                            key={productVariant._id}
                                            className={` flex justify-center align-middle overflow-hidden max-w-[50px] p-0 ${productVariant._id === selectedProduct._id ? "border border-b border-black" : ""} `}

                                            onClick={() => setSelectedProduct(productVariant)}
                                        >
                                            <img
                                                src={
                                                    selectedProduct.images.length !== 0
                                                        ? `http://localhost:9003/picture/${selectedProduct.images[0]}`
                                                        : IMAGE_NOT_FIND
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </CarouselItem>

                                    ))}

                            </CarouselContent>

                            <div className={'Button-box Button-box-right ml-1.5'}>

                                <CarouselNext />
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
                                                src={
                                                    selectedProduct.images.length !== 0
                                                        ? `http://localhost:9003/picture/${selectedProduct.images[0]}`
                                                        : IMAGE_NOT_FIND
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                    ))}

                            </div>


                        </section>
                    }
                    <section className={'text-base font-medium mt-3'}>
                        {product.name}
                    </section>

                    <section className={'text-base font-medium mt-3'}>
                        {}
                    </section>

                </div>
            </section>
        </div>
    );
};

export default ProductCart;
