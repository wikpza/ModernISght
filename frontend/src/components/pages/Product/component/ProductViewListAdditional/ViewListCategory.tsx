import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "../../../../ui/carousel.tsx";
import ProductViewElement from "./ProductViewElement.tsx";
import {useNavigate} from "react-router-dom";


type Props = {
    listElement:{picture:string, url:string, name:string}[]
}
const ViewListCategory = ({listElement}:Props) => {
    const navigate = useNavigate()
    return (
        <div className={"py-2"}>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-sm flex flex-1 box-carousel_box ">

                <div className={'Button-box  Button-box-left mr-1.5 ProductViewListButton'}>
                    <CarouselPrevious/>
                </div>

                <CarouselContent className=" ml-0 w-full flex-1 box-content_product gap-5 "
                                 style={{display: "flex"}}>
                    {listElement.map((item, index)=>(
                        <CarouselItem
                            key={index}
                            className={`relative flex  overflow-hidden  p-0 mr-2 cursor-pointer  max-w-fit `}
                            onClick={() => {
                                navigate(`/products/category/${item.url}/gender/men`)
                                window.location.reload();
                            }}
                        >

                            <ProductViewElement name={item.name} imgSrc={item.picture}/>

                        </CarouselItem>
                    ))}


                </CarouselContent>
                <div className={'Button-box Button-box-right ml-1.5 ProductViewListButton'}>

                    <CarouselNext />
                </div>
            </Carousel>
        </div>
    );
};

export default ViewListCategory;