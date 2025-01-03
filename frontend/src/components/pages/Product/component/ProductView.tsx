import { useState, useEffect } from "react";
import { Item } from "../../admin/Brand/element/ItemList.tsx";
import ProductViewParams from "./ProductViewParams.tsx";
import {getProductsRequest} from "../../../../api/ProductAPI.tsx";
import ProductViewList from "./ProductViewList.tsx";
import { GetProductUser } from "../../../../types/product.type.ts";
import {Button} from "../../../ui/button.tsx";

import {LuSettings2} from "react-icons/lu";
import ComboBoxProductView from "./ComboBoxProductView.tsx";
import {HiMiniArrowsUpDown} from "react-icons/hi2";
import SortParamsProductDialog from "./SortParamsProductDialog.tsx";

export type ParamsSearch = {
    categories: Item[];
    colors: { name: string; hexCode: string; _id: string }[];
    collections: Item[];
    brands: Item[];
    genders: Item[];
    sortBy: string;
    sortType: number;
    priceLess: number;
    priceMore: number;
    page: number;
    limit: number;
};


const SortParams = [
    {name:"Popularity", value:"rating"},
    {name:"Price", value:"price"},
]


const ProductView = () => {
    const [params, setParams] = useState<ParamsSearch>({
        categories: [],
        colors: [],
        collections: [],
        brands: [],
        genders: [],
        sortType: 1,
        sortBy: "rating",
        priceLess: 1000,
        priceMore: 0,
        page: 1,
        limit: 10,
    });


    const [productList, setProductList] = useState<GetProductUser[]>([]);
    const [showFilter, setShowFilter] = useState<boolean>(true)

    useEffect( () => {
        const getProductFunction = getProductsRequest(params)
        getProductFunction().then((value)=>{
            setProductList( value || []);
        })



        console.log(params)
    }, [params]);

    return (
        <div>
            <section className={'flex justify-between'}>

                <div className={"block lg:hidden"}>
                    <SortParamsProductDialog  params={params} setParams={setParams} className={""}/>
                </div>

                <div className={'hidden lg:block '}>
                    <Button className={'bg-white hover:bg-white border border-gray-400 text-black font-bold p-5'}
                    onClick={()=>setShowFilter(!showFilter)}>
                        <LuSettings2 className={'text-gray-500 text-lg'}/>
                        {showFilter? "Hide Filters" :"Show Filters"}
                    </Button>
                </div>



                <div className={"flex w-fit"}>
                    <HiMiniArrowsUpDown className={`items-center h-full  border w-fit rounded text-sm px-2 font-light mr-3 ${params.sortType === 1?" border-gray-400 text-gray-600":"  border-gray-600 text-gray-800 "}`} onClick={()=>setParams({...params, sortType: params.sortType === 1? -1:1})}/>
                    <ComboBoxProductView options={SortParams} onChange={(value)=> setParams({...params, sortBy:value.value})} label = {params.sortBy === "rating"?"Popularity":"Price"} />
                </div>



            </section>

            <section className={"flex"}>
                {/* Компонент фильтров, который передает новые параметры */}
                <div className={`${showFilter?"block":"hidden"}`}>
                    <ProductViewParams params={params} setParams={setParams} className={` mt-10 hidden lg:block w-[300px] mr-5` } />
                </div>


                {/* Список продуктов */}
                {!productList ?(
                    <div>Error loading products</div>
                ) : (

                    <ProductViewList product={productList} />


                )}

            </section>

        </div>
    );
};

export default ProductView;
