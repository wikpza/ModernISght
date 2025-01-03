import {HomeList} from "../../../lib/utils.ts";
import ItemListCategory from "./ItemListCategory.tsx";
import {useNavigate} from "react-router-dom";
import {Carousel, CarouselContent, CarouselItem} from "../../ui/carousel.tsx";

const HomeCarouselCategory = () => {
    const navigate = useNavigate()

    return (
        <div>
            <section className={'flex justify-center items-center text-2xl font-medium mb-5'}>
                <div>Categories</div>
            </section>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-sm flex flex-1 box-carousel_box ">


                <CarouselContent className=" ml-0 w-full flex-1 box-content_product gap-5 "
                                 style={{display: "flex"}}>


                    {HomeList.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className={`relative flex  overflow-hidden  p-0 mr-2 cursor-pointer sm:max-w-[32%] max-w-fit`}
                            onClick={() => {
                                navigate(item.url)
                                window.location.reload();
                            }}
                        >
                            <ItemListCategory picture={item.picture} name={item.name}/>

                        </CarouselItem>
                    ))}


                </CarouselContent>
            </Carousel>
        </div>


    );
};

export default HomeCarouselCategory;