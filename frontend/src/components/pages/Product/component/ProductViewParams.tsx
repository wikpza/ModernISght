
import {useGetCategories} from "../../../../api/CategoryApi.tsx";
import {useGetCollections} from "../../../../api/CollectionApi.tsx";
import {useGetGenders} from "../../../../api/GenderAPI.tsx";
import {useGetBrands} from "../../../../api/BrandApi.tsx";

import {Separator} from "../../../ui/separator.tsx";
import ParamsAccardion from "../../Product/component/ParamsAccardion.tsx";
import {useParams} from "react-router-dom";
import {useState} from "react";
import {ParamsSearch} from "./ProductView.tsx";

type Props = {
    params:ParamsSearch,
    setParams:(value:ParamsSearch)=>void,
    className:string
}
const ProductViewParams = ({params, setParams, className}:Props) => {
    const { category:findCategory, gender:findGender } = useParams<{ category: string; gender: string }>();
    const [changedCategory, setChangedCategory] = useState<boolean>(true)
    const [changedGender, setChangedGender] = useState<boolean>(true)
    const {categories} = useGetCategories();
    const {collections} = useGetCollections()
    const {genders} = useGetGenders()
    const {brands} = useGetBrands()
    // const {colors} = useGetColors()

    if(changedCategory && findCategory && categories && (params.categories.findIndex((element)=>element.name.toLowerCase() === findCategory?.toLocaleLowerCase())) === -1){
        const findElement = categories.find((element)=>element.name.toLocaleLowerCase() === findCategory?.toLowerCase())
        if(findElement) setParams({...params, categories:[...params.categories, findElement]})
        setChangedCategory(false)
    }

    if(changedGender && findGender && genders && (params.genders.findIndex((element)=>element.name.toLowerCase() === findGender?.toLocaleLowerCase())) === -1){
        const findElement = genders.find((element)=>element.name.toLocaleLowerCase() === findGender?.toLowerCase())
        if(findElement) setParams({...params, genders:[...params.genders, findElement]})
        setChangedGender(false)
    }



    return (
        <div className={'p-2  relative ' + className}>
            <div className={'sticky top-40 left-1'}>
                <Separator className={"bg-gray-600 h-[1px] w-full"}/>
                <ParamsAccardion items={categories || []} name={"Categories"}  itemHave={params.categories} setItem={
                    (item)=>{
                        setParams({...params,categories:item })}}/>

                <ParamsAccardion items={collections || []} name={"Collections"}  itemHave={params.collections} setItem={
                    (item)=>{
                        setParams({...params,collections:item })}}/>

                <ParamsAccardion items={genders || []} name={"Genders"}  itemHave={params.genders} setItem={
                    (item)=>{
                        setParams({...params,genders:item })}}/>

                <ParamsAccardion items={brands || []} name={"Brands"}  itemHave={params.brands} setItem={
                    (item)=>{
                        setParams({...params,brands:item })}}/>

                {/*<ColorViewAccordion items={colors || []} itemHave={params.colors} name={"Colors"} setItem={ (item)=>{*/}
                {/*    setParams({...params,brands:item })}}/>*/}
            </div>
        </div>
    );
};

export default ProductViewParams;