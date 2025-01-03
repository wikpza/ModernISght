import "./carousel.css"
import {useParams} from "react-router-dom";
import {menListCategory, womanListCategory} from "../../../../../lib/utils.ts";
import ViewListCategory from "./ViewListCategory.tsx";
const ProductViewListAddition = () => {


    const { category:findCategory, gender:findGender } = useParams<{ category: string; gender: string }>();

    if(findGender && findGender === 'men' && !findCategory){
        return (
            <ViewListCategory listElement={menListCategory}/>
        )
    }
    if(findGender && findGender === 'woman' && !findCategory){
        return (
            <ViewListCategory listElement={womanListCategory}/>
        )
    }
    return (
   <div></div>
    );
};

export default ProductViewListAddition;