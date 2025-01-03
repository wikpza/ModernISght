import ProductView from "./component/ProductView.tsx";
import ProductViewListAddition from "./component/ProductViewListAdditional/ProductViewListAddition.tsx";
import RecommendedProductList from "../../elements/RecommendedProductList.tsx";
import {Separator} from "../../ui/separator.tsx";
const CustomProductViewPage = () => {


    return (
        <div>
            <section className={'mb-5 mt-5'}>
                <ProductViewListAddition/>
            </section>

            <section>
                <ProductView></ProductView>
            </section>

            <section className={'mt-20 '}>
                <Separator className={'w-full h-[1px] bg-gray-400 mb-20'}/>
                <RecommendedProductList />
            </section>
        </div>
    );
};

export default CustomProductViewPage;