
import EmblaCarousel from "../ui/carousel/EmblaCarousel.tsx";
import {EmblaOptionsType} from "embla-carousel";

const AdditionalHeader = () => {
    const SLIDE_WORDS = ['  Kid\'s shoes under $75.', 'Our best-selling shoes and clothing', ' Free shipping and returns for member.']
    const OPTIONS: EmblaOptionsType = {}

    return (
        <div className={' text-sm flex justify-center'} style={{backgroundColor:"#efefef"}}>




            <EmblaCarousel slides={SLIDE_WORDS} options={OPTIONS} />

        </div>
    );
};

export default AdditionalHeader;


