import {GetProductUser} from "../../../../types/product.type.ts";
import ProductViewCart from "./ProductViewCart.tsx";

type Props = {
    product:GetProductUser[] | undefined
}
const ProductViewList = ({product}:Props) => {

    return (



        <div className={'ProductList  grid grid-cols-2 xl:gap-4 xl:grid-cols-3 justify-center items-stretch w-full xl:gap-y-10'}>
            {product && product.map((item, index) => (
                <ProductViewCart product={item} key={index}/>
            ))}
        </div>
    );
};

export default ProductViewList;