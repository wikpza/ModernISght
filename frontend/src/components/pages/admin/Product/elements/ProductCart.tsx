import {Brand, Category, Collection, Gender, ProductVariant} from "../../../../../types.ts";
import {useEffect, useState} from "react";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../../../../ui/carousel.tsx";
import CustomCombobox from "../../../../elements/ComboboxCustom.tsx";
import {Input} from "../../../../ui/input.tsx";
import {TiPlus} from "react-icons/ti";
import CustomButton from "../../../../ui/CustomButton.tsx";
import {useDeleteProduct, useUpdateProduct} from "../../../../../api/ProductAPI.tsx";
import {toast} from "sonner";
import {Product, UpdateProduct} from "../../../../../types/product.type.ts";
import {Button} from "../../../../ui/button.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../../ui/accordion.tsx";
import "./product.css"
import {Checkbox} from "../../../../ui/checkbox.tsx";
import {validateUpdateProduct} from "../../../../../lib/validateFunction.ts";
import {useNavigate} from "react-router-dom";
import {calculateDiscountedPrice, isDiscountActive} from "../../../../../lib/utils.ts";


const ProductCart = ({ product, brands, collections }:
                         { product: Product, brands:Brand[], categories:Category[], collections:Collection[], genders:Gender[] }) => {
    const [selectedProduct, setSelectedProduct] = useState<ProductVariant>(
        product.productVariant[0] || {}
    );

    const [imageUrl, setImageUrl] = useState("https://www.mobismea.com/upload/iblock/2a0/2f5hleoupzrnz9o3b8elnbv82hxfh4ld/No%20Product%20Image%20Available.png");
    const {updateProduct, isSuccess:isUpdateSuccess} = useUpdateProduct()

    const productFeatures = product.features ? Object.entries(product.features).map(([key, value]) => ({
        key,
        value
    })) || [] : []

    const [productOption, setProductOption] = useState<UpdateProduct>(
        {
            name: product.name,
            brand: {_id:product.brandId._id, name:product.brandId.name},
            collection: {_id:product.collectionId._id, name:product.collectionId.name},
            active:product.active,
            features:productFeatures
        }
    )

    const navigate = useNavigate()
    const {deleteProduct, isSuccess:isDeleteSuccess} = useDeleteProduct()

    if(isUpdateSuccess){
        toast.success('product successfully added')
       window.location.reload()
    }

    if(isDeleteSuccess){
        toast.success('product successfully deleted')
        // window.location.reload()
    }


    useEffect(() => {
        if (selectedProduct.images && selectedProduct.images.length !== 0) {
            setImageUrl(`http://localhost:9003/picture/${selectedProduct.images[0]}`);
        }
    }, [selectedProduct]); // Зависимость от selectedProduct
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
    const handleSubmit = ()=>{

        if(product.name.trim() === productOption.name &&
            product.collectionId._id === productOption.collection._id &&
            product.brandId._id === productOption.brand._id &&
            product.active === productOption.active &&
            JSON.stringify(productFeatures) === JSON.stringify(product.features)
        ){
            toast.error("haven't changed anything")
            return false
        }

        if(validateUpdateProduct(productOption)){
            updateProduct({product:productOption, id:product._id})
        }

    }

    console.log(product.productVariant)

    return (
        <div className= {`rounded max-w-[400px] h-fit flex-row m-2 space-y-2 ${product.productVariant.length === 0? "h-fit":"h-fit"}`} >

            <section className=" relative w-auto h-full flex justify-center align-middle overflow-hidden product-cart ">
                <img
                    src={imageUrl}
                    alt={product.name}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={()=>navigate(`/admin/product/${product._id || ""}/${selectedProduct._id || ""}`)}
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
                                        <CarouselPrevious />
                                    </div>

                                    <CarouselContent className=" ml-0 w-full flex-1 box-content_product "
                                                     style={{display: "flex"}}>


                                        {product.productVariant && product.productVariant.length !== 0 &&
                                            product.productVariant.map((productVariant) => (
                                                <CarouselItem
                                                    key={productVariant._id}
                                                    className={`relative flex justify-center align-middle overflow-hidden max-w-[50px] p-0 mr-2 ${productVariant._id === selectedProduct._id ? "border border-b border-black" : ""} `}

                                                    onClick={() => setSelectedProduct(productVariant)}
                                                >
                                                    <img
                                                        src={productVariant.images.length !==0? `http://localhost:9003/picture/${productVariant.images[0].replace(
                                                            /\.webp$/,
                                                            "_s.webp"
                                                        )}` : "https://www.mobismea.com/upload/iblock/2a0/2f5hleoupzrnz9o3b8elnbv82hxfh4ld/No%20Product%20Image%20Available.png"}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />


                                                </CarouselItem>

                                            ))}


                                    </CarouselContent>

                                    <div className={'Button-box Button-box-right ml-1.5 '}>

                                        <CarouselNext/>
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
                                                        src={`http://localhost:9003/picture/${(productVariant.images[0]? productVariant.images[0]:"").replace(
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

                <div
                    onClick={() => navigate(`/admin/product/new/${product._id}`)}
                    className={'border-4 border-green-500 rounded m-1 cursor-pointer  hover:bg-green-500 transition-all h-[50px] w-[50px]'}>
                    <TiPlus className={'w-full h-full text-green-500 hover:text-white transition-all'}
                    />
                </div>

                <section className={'py-2 text-sm text-gray-500'}>
                    {`${product.genderId.name} / ${product.categoryId.name} `}
                </section>
                <section className={'text-base font-medium mt-3'}>
                    <div
                        className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                        <Input
                            placeholder={"input name"}
                            className={'border-none'}
                            value={productOption.name}
                            onChange={(e) =>
                                setProductOption({...productOption, name: e.target.value})
                            }
                        />
                    </div>
                </section>

                <Accordion type="single" collapsible
                           className={' p-0 border border-gray-400 rounded-md   flex items-center justify-center accordion_feature_list'}>
                    <AccordionItem value="item-1">

                        <AccordionTrigger className={"text-base ml-5"}>Product Options</AccordionTrigger>
                        <AccordionContent className={'space-y-2 '}>

                            <section
                                className={' border-none border-gray-400 rounded-md px-5 py-2 bg-gray-300 flex items-center justify-center'}>
                                {brands &&
                                    <CustomCombobox listOfValue={brands} selectedName={productOption.brand}
                                                    setName={(value: {
                                                        _id: string,
                                                        name: string
                                                    }) => setProductOption({...productOption, brand: value})}
                                                    optionName={"Brand"}/>
                                }
                            </section>
                            <section
                                className={'border-none border-gray-400 rounded-md px-5 py-2 bg-gray-300 flex items-center justify-center'}>
                                {collections &&
                                    <CustomCombobox listOfValue={collections} selectedName={productOption.collection}
                                                    setName={(value: {
                                                        _id: string,
                                                        name: string
                                                    }) => setProductOption({...productOption, collection: value})}
                                                    optionName={"Collection"}/>
                                }
                            </section>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


                <Accordion type="single" collapsible
                           className={'p-0 border border-gray-400 rounded-md  bg-white flex items-center justify-center accordion_feature_list'}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className={"text-base ml-5"}>Product Features</AccordionTrigger>
                        <AccordionContent>

                            <section className="grid gap-4">
                                {productOption.features && productOption.features?.map((sizeValue, index) => (
                                    <section key={index}>

                                        <div key={index} className={'space-y-2'}>

                                            <div
                                                className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                                                <Input
                                                    placeholder={"input feature name"}
                                                    className={'border-none'}
                                                    value={sizeValue.key}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        const newFeatures = productOption.features.map((inputSize, inputIndex) =>
                                                            inputIndex === index ? {
                                                                ...inputSize,
                                                                key: newValue
                                                            } : inputSize
                                                        )

                                                        setProductOption({
                                                            ...productOption,
                                                            features: newFeatures
                                                        })
                                                    }}
                                                />
                                            </div>

                                            <div
                                                className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                                                <Input
                                                    placeholder={"input the value of feature"}
                                                    className={'border-none'}
                                                    value={sizeValue.value}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        const newFeatures = productOption.features.map((inputSize, inputIndex) =>
                                                            inputIndex === index ? {
                                                                ...inputSize,
                                                                value: newValue
                                                            } : inputSize
                                                        )

                                                        setProductOption({
                                                            ...productOption,
                                                            features: newFeatures
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </div>


                                        <div
                                            onClick={() =>
                                                setProductOption({
                                                    ...productOption,
                                                    features: productOption.features.filter((_, i) => i !== index)
                                                })}
                                        >
                                            <CustomButton
                                                className=" w-full p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 "
                                            >Delete feature</CustomButton>
                                        </div>


                                    </section>
                                ))}
                                <Button
                                    className={'py-2 bg-green-500 rounded-sm border-gray-400 border-2 hover:bg-green-600 mt-2'}
                                    type={"button"}
                                    onClick={() =>
                                        setProductOption({
                                            ...productOption,
                                            features: [...productOption.features, {key: "", value: ""}]
                                        })}>Add Feature</Button>
                            </section>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>



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


                <section className={'flex items-center'}>
                    <Checkbox
                        onCheckedChange={() => setProductOption({...productOption, active: !productOption.active})}
                        checked={productOption.active} className={'mr-3'}></Checkbox>
                    <div> is active</div>
                </section>

                <section className={'flex '}>

                    <div
                        className={"w-full"}
                            onClick={()=>deleteProduct(product._id || "")}>
                        <CustomButton
                            className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 w-full"
                        >
                            Delete
                        </CustomButton>
                    </div>

                    <div
                        onClick={handleSubmit}
                        className={'w-full'}> {/* flex-col для вертикального расположения кнопок */}

                        <CustomButton
                            className=" w-full p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 !bg-blue-500"
                        >
                            Update
                        </CustomButton>
                    </div>

                </section>


            </div>

        </div>
    );
};

export default ProductCart;
