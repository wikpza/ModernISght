import {GetProductElement} from "../../../types/product.type.ts";
import {EmblaOptionsType} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {DotButton, useDotButton} from "../../ui/carousel/EmblaCarouselDotButton.tsx";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {Separator} from "../../ui/separator.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getInventory} from "../../../types/inventory.type.ts";
import "./style.css"
import CustomButton from "../../ui/CustomButton.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../ui/accordion.tsx";
import {toast} from "sonner";
import {useAddCart} from "../../../api/CartAPI.tsx";
import {calculateDiscountedPrice, isDiscountActive} from "../../../lib/utils.ts";
import RecommendedProductList from "../../elements/RecommendedProductList.tsx";


type Props ={
    product:GetProductElement,
    indexElement:number,
    productInventory:getInventory[]
}
const ProductPersonalForm = ({product, indexElement, productInventory}:Props) => {


    const emblaOptions: EmblaOptionsType = {
        loop: true, // Включаем цикличность слайдов
    };

    useEffect(() => {

    }, [productInventory]);
    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    const [selectedSize, setSelectedSize] = useState<getInventory>(

        {
            size:"",
            sizeId:"",
            quantity:0
        }
    )

    const navigate = useNavigate()

    const {addCart, isSuccess} = useAddCart()


    const handlerAddCart = ()=>{
        if(selectedSize.sizeId === ""){
            toast.error("choose the size")
            return
        }else{
            addCart(
                {
                    productId:product.productVariant[indexElement]._id,
                    sizeId:selectedSize.sizeId,
                    quantity:1
                }
            )
        }

    }

    if(isSuccess) navigate("/account/cart")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const onPrevButtonClick = () => emblaApi.scrollPrev();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const onNextButtonClick = () => emblaApi.scrollNext();


    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 font-sans ">

                <div className={'relative'}>
                    <section className="p-4 lg:grid hidden lg:grid-cols-[1fr_1fr] gap-1 sticky top-20 ">

                        {product.productVariant[indexElement].images.length !== 0 && product.productVariant[indexElement].images.map((image, index) => (
                            <div key={index} className="relative">
                                {/* Изображение */}
                                <img src={`http://localhost:9003/picture/${image}`} alt={`Uploaded image ${index + 1}`}
                                     className="max-w-full h-auto"/>

                            </div>
                        ))}


                    </section>

                    <section className={"lg:hidden block "}>
                        <section className="embla">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">

                                    {product.productVariant[indexElement].images.length > 0 &&
                                        product.productVariant[indexElement].images.map((image, index) => (
                                            <div key={index} className="relative embla__slide">
                                                {/* Изображение */}
                                                <img src={`http://localhost:9003/picture/${image}`}
                                                     alt={`Uploaded image ${index + 1} `}
                                                     className="max-w-full h-auto embla__slide__image"/>
                                            </div>


                                        ))}
                                </div>
                            </div>

                            {
                                (product.productVariant[indexElement].images.length !== 0 &&
                                    <div className="embla__controls w-full flex justify-between px-4">

                                        <div className="embla__buttons py-2">

                                            <IoIosArrowBack onClick={onPrevButtonClick}
                                                            className={`text-5xl bg-gray-300 rounded-2xl `}/>

                                            <IoIosArrowForward onClick={onNextButtonClick}
                                                               className={"text-5xl bg-gray-300 rounded-2xl ml-1"}/>
                                        </div>

                                        <div className="embla__dots">
                                            {scrollSnaps.map((_, index) => (
                                                <DotButton
                                                    key={index}
                                                    onClick={() => onDotButtonClick(index)}
                                                    className={
                                                        'embla__dot' +
                                                        (index === selectedIndex ? ' embla__dot--selected' : '')
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>)
                            }

                        </section>

                    </section>
                </div>

                <div className="p-4 pb-4 lg:max-w-[400px]">

                    <section className={'space-y-2'}>
                        <div>{product.genderId.name}</div>
                        <div className={'text-4xl font-medium'}>{product.name}</div>
                    </section>

                    {product.productVariant[0].discountInfo && isDiscountActive(product.productVariant[0].discountInfo) ?

                        <section className={'text-base  mt-3'}>
                            <span className={'line-through text-gray-500 mr-3'}>${product.productVariant[0].price}</span>
                            <span
                                className={'mr-3'}>${calculateDiscountedPrice(product.productVariant[0].price,product.productVariant[0].discountInfo.percent)}</span>
                            <div>
                                <span
                                    className={'text-yellow-600 mr-3'}>{product.productVariant[0].discountInfo.name}</span>
                                <span
                                    className={'text-yellow-600'}>{product.productVariant[0].discountInfo.percent}% off</span>
                            </div>

                        </section>
                        :
                        <section className={'text-base  mt-3'}>
                            {product.productVariant[0].price ?
                                `$${product.productVariant[0].price}` : "haven't added product Variant"
                            }

                        </section>
                    }


                    <section className={'flex items-center w-full max-w-[400px] my-5'}>
                        <div style={{backgroundColor: "#f1f1f1"}} className={'p-1 flex rounded w-full max-h-[60px]'}>
                            <section
                                className={'border border-gray-500 rounded-md px-5 py-2 bg-white w-1/2 flex items-center justify-center cursor-pointer'}>
                                {product?.genderId.name}
                            </section>
                            <section className={'flex items-center justify-center w-1/2 cursor-pointer'}>
                                {product?.categoryId.name}
                            </section>
                        </div>
                    </section>


                    <section className={'space-y-2'}>
                        <div className={'text-sm'}>{product.productVariant[indexElement].colorId.name}</div>
                        <div className={'flex flex-wrap gap-2'}>
                            {product.productVariant.length !== 0 &&
                                product.productVariant.map((clothe, index) => (
                                    <div className={'w-[60px] h-[60px] rounded cursor-pointer'} key={index}
                                         onClick={() => navigate(`/products/${product._id}/${clothe._id}`)}>
                                        <img
                                            src={clothe.images[0] ? `http://localhost:9003/picture/${clothe.images[0].replace(/\.webp(?!.*\.webp)/, "_s.webp")}` : "https://www.mobismea.com/upload/iblock/2a0/2f5hleo…nbv82hxfh4ld/No%20Product%20Image%20Available.png"}
                                            alt={`Uploaded image ${index + 1} `}
                                            className={`max-w-full h-auto embla__slide__image rounded ${index === indexElement ? "border-2" : "border-none"}`}
                                            style={{borderColor: clothe.colorId.hexCode === "#FFFFFF" ? "black" : clothe.colorId.hexCode}}/>
                                    </div>
                                ))}
                        </div>
                    </section>

                    <div className={' mt-5'}>Size :</div>
                    <section className="grid gap-2 mt-1" style={{gridTemplateColumns: 'repeat(5, 1fr)',}}>
                        {productInventory && productInventory.map((size, index) => (
                            <div key={index}
                                 onClick={() => {
                                     if (size.quantity !== 0) setSelectedSize(size)
                                 }}
                                 className={`p-2  border-2 rounded flex items-center justify-center cursor-pointer ${size.quantity === 0 ? "text-gray-400 bg-gray-200 hover:bg-gray-200 border-gray-300" : "hover:bg-gray-400 hover:border-black border-gray-400 "} 
                                 ${selectedSize.sizeId === size.sizeId ? " !bg-gray-400 !border-black " : ""}`}

                            >
                                {size.size}
                            </div>
                        ))}

                    </section>

                    <div className={'pt-5 space-y-5'}>
                        <Separator className={'bg-gray-400 h-[1px]'}/>
                        <div onClick={handlerAddCart}>
                            <CustomButton className={" w-full h-[55px] text-lg rounded"}>
                                Add to Cart
                            </CustomButton>
                        </div>

                    </div>

                    <Separator className={'bg-gray-400 h-[1px] mt-14 '}/>
                    <div className={''}>
                        {product.features && Object.keys(product.features).length !== 0 &&
                            Object.entries(product.features).map(([key, value], index) => (
                                <div key={index}>
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>{key}</AccordionTrigger>
                                            <AccordionContent>{value}</AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            ))
                        }
                    </div>

                </div>

            </div>


            <Separator className={'bg-gray-400 h-[1px] my-14'}/>
            <RecommendedProductList category={product.categoryId.name} gender={product.genderId.name}/>

        </div>
    );
};

export default ProductPersonalForm;
