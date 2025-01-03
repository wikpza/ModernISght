import {useEffect, useState} from "react";
import {useGetRandomProductsUser} from "../../../api/ProductAPI.tsx";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../../ui/carousel.tsx";
import "./home.css"
import ProductViewCart from "../Product/component/ProductViewCart.tsx";

const GenderHomeList = () => {
    const [selectedGender, setSelectedGender] = useState<string>("Men")

    const {products, refetch} = useGetRandomProductsUser({gender:selectedGender, category:""})

    useEffect(() => {
        refetch()
    }, [selectedGender]);
    return (
        <div>
            <section className={'flex justify-center items-center mb-5'}>
                <div style={{backgroundColor: "#f1f1f1"}} className={'p-1 flex rounded w-[250px] max-h-[60px]'}>
                    <section
                        onClick={()=>setSelectedGender("Men")}
                        className={`cursor-pointer w-1/2 flex items-center justify-center ${selectedGender === "Men"? "border border-gray-500 rounded-md px-5 py-2 bg-white ":""}`}>
                        Men
                    </section>
                    <section
                        onClick={()=>setSelectedGender("Woman")}
                        className={`cursor-pointer w-1/2 flex items-center justify-center ${selectedGender === "Woman"? "border border-gray-500 rounded-md px-5 py-2 bg-white ":""}`}>
                        Woman
                    </section>
                </div>
            </section>

            <section>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full max-w-sm flex flex-1 box-carousel_box ">

                    <div className={'Button-box  Button-box-left mr-1.5 HomeProductList'}>
                        <CarouselPrevious style={{position: "relative!important"}}/>
                    </div>

                    <CarouselContent className=" ml-0 w-full flex-1 box-content_product gap-5 "
                                     style={{display: "flex"}}>



                        {products && products.map((product, index)=>(
                            <CarouselItem className={'max-w-[400px]'}>
                                <ProductViewCart product={product} key={index}/>
                            </CarouselItem>
                        ))}


                    </CarouselContent>
                    <div className={'Button-box Button-box-right ml-1.5 HomeProductList'}>

                        <CarouselNext style={{position: "relative!important"}}/>
                    </div>
                </Carousel>

            </section>

        </div>
    );
};

export default GenderHomeList;