import {CreateProduct, UpdateProduct} from "../types/product.type.ts";
import {toast} from "sonner";


export const isIntegerString = (str: string): boolean => {
    const num = parseInt(str, 10);  // Преобразуем строку в целое число
    return Number.isInteger(num) && num.toString() === str.trim();  // Проверяем, что это целое число и строка не имеет лишних символов
}


export const validateCreateProduct = (input:CreateProduct)=>{

    if (input.category._id === "") {
        toast.error("Please select a category.");
        return false
    }

    if (input.gender._id === "") {
        toast.error("Please select a gender.");
        return false
    }

    if(input.collection._id === ""){
        toast.error('input the collection')
        return false
    }

    if(input.brand._id === ""){
        toast.error('input the brand')
        return false
    }

    if(input.name === ""){
        toast.error('input the name')
        return false
    }

    if(input.features.length === 0) return true

    const newFeatureDuplicate = input.features
        .filter((item, index, self) =>
            self.findIndex(t => t.key === item.key) === index
        );

    if(newFeatureDuplicate.length !== input.features.length){
        toast.error('feature name must be unique')
        return false
    }

    const emptyFeature = input.features
        .filter(item => item.key !== "" && item.value !== "");

    if(emptyFeature.length !== input.features.length){
        toast.error('input all fields')
        return false
    }

    return true
};

export const validateUpdateProduct=(productOption:UpdateProduct)=>{
    if(productOption.name.trim() === ""){
        toast.error("name can't be empty")
        return false
    }

    if(productOption.brand._id === ""){
        toast.error("select brand")
        return false
    }


    if(productOption.collection._id === ""){
        toast.error("select collection")
        return false
    }

    if(productOption.features.length === 0) return true

    const newFeatureDuplicate = productOption.features
        .filter((item, index, self) =>
            self.findIndex(t => t.key === item.key) === index
        );

    if(newFeatureDuplicate.length !== productOption.features.length){
        toast.error('feature name must be unique')
        return false
    }

    const emptyFeature = productOption.features
        .filter(item => item.key !== "" && item.value !== "");

    if(emptyFeature.length !== productOption.features.length){
        toast.error('input all fields')
        return false
    }

    return true

}