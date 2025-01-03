import { observer } from "mobx-react-lite";
import { useState} from "react";
import CustomButton from "../ui/CustomButton.tsx";
import { useGetCategories } from "../../api/CategoryApi.tsx";
import CustomCombobox from "../elements/ComboboxCustom.tsx";
import {Separator} from "../ui/separator.tsx";
import {useGetGenders} from "../../api/GenderAPI.tsx";
import {Input} from "../ui/input.tsx";
import {Button} from "../ui/button.tsx";
import {toast} from "sonner";
import {useGetCollections} from "../../api/CollectionApi.tsx";
import {useGetBrands} from "../../api/BrandApi.tsx";
import {CreateProduct} from "../../types/product.type.ts";
import {Checkbox} from "../ui/checkbox.tsx";
import {useCreateProduct} from "../../api/ProductAPI.tsx";
import {validateCreateProduct} from "../../lib/validateFunction.ts";




const ProductForm = observer(() => {

    const { categories, isLoading:categoriesIsLoading } = useGetCategories();
    const {genders, isLoading:genderIsLoading} = useGetGenders()
    const {collections, isLoading:collectionIsLoading} = useGetCollections()
    const {brands, isLoading:brandIsLoading} = useGetBrands()

    const {createProduct, isSuccess} = useCreateProduct()

    const [productOptions, setProductOptions] = useState<CreateProduct>(
        {
            category:{name:"", _id:""},
            brand:{name:"", _id:""},
            collection:{name:"", _id:""},
            gender:{name:"", _id:""},
            name:"",
            active:true,
            features:[],
        }
    );


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedFeatures = productOptions.features
            .map(item => ({
            key: item.key.trim(),
            value: item.value.trim()
        }))


        setProductOptions({ ...productOptions, features: trimmedFeatures });

        if (validateCreateProduct(productOptions)) {
            createProduct(productOptions)
        }

    };

    if(isSuccess){
        toast.success('Product successfully added')
       window.location.reload()
    }


    return (
        <form onSubmit={handleSubmit} className={'flex-1 h-full '}>

            <div
                 className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                <Input
                    placeholder={"input name of product"}
                    className={'border-none font-serif'}
                    value={productOptions.name}
                    onChange={(e) => setProductOptions({...productOptions, name:e.target.value})}
                />
            </div>

            <section
                className={'min-w-[250px] flex flex-col h-full'}> {/* Изменено на flex-col для вертикального размещения */}

                <div style={{backgroundColor: "#f1f1f1"}} className={'p-1 rounded space-y-2'}>
                    <section
                        className={'border border-gray-400 rounded-md px-5 py-2 bg-white flex items-center justify-center'}>
                        {!categoriesIsLoading && categories &&
                            <CustomCombobox listOfValue={categories} selectedName={productOptions.category}
                                            setName={(value) => setProductOptions({...productOptions, category: value})}
                                            optionName={"Category"}/>
                        }
                    </section>

                    <section
                        className={'border border-gray-400 rounded-md px-5 py-2 bg-white flex items-center justify-center'}>
                        {!genderIsLoading && genders &&
                            <CustomCombobox listOfValue={genders} selectedName={productOptions.gender}
                                            setName={(value) => setProductOptions({...productOptions, gender: value})}
                                            optionName={"Gender"}/>
                        }
                    </section>

                    <section
                        className={'border border-gray-400 rounded-md px-5 py-2 bg-white flex items-center justify-center'}>
                        {!brandIsLoading && brands &&
                            <CustomCombobox listOfValue={brands} selectedName={productOptions.brand}
                                            setName={(value) => setProductOptions({...productOptions, brand: value})}
                                            optionName={"Brand"}/>
                        }
                    </section>

                    <section
                        className={'border border-gray-400 rounded-md px-5 py-2 bg-white flex items-center justify-center'}>
                        {!collectionIsLoading && collections &&
                            <CustomCombobox listOfValue={collections} selectedName={productOptions.collection}
                                            setName={(value) => setProductOptions({
                                                ...productOptions,
                                                collection: value
                                            })}
                                            optionName={"Collection"}/>
                        }
                    </section>
                </div>

                <Separator className={"bg-gray-400 my-3"}/>

                <section className="grid gap-4">
                    {productOptions.features && productOptions.features?.map((sizeValue, index) => (
                        <section  key={index}>

                            <div key={index} className={'space-y-2'}>

                                <div
                                     className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                                    <Input
                                        placeholder={"input feature name"}
                                        className={'border-none'}
                                        value={sizeValue.key}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            const newFeatures = productOptions.features.map((inputSize, inputIndex) =>
                                                inputIndex === index ? {...inputSize, key:newValue} : inputSize
                                            )

                                            setProductOptions( {...productOptions,
                                            features: newFeatures })
                                        }}
                                    />
                                </div>

                                <div
                                     className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                                    <Input
                                        placeholder={"input the value of feature"}
                                        className={'border-none'}
                                        value={sizeValue.value}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            const newFeatures = productOptions.features.map((inputSize, inputIndex) =>
                                                inputIndex === index ? {...inputSize, value:newValue} : inputSize
                                            )

                                            setProductOptions( {...productOptions,
                                                features: newFeatures })
                                        }}
                                    />
                                </div>
                            </div>




                                <div
                                    onClick={() =>
                                        setProductOptions({...productOptions, features:productOptions.features.filter((_, i) => i !== index)})}
                                >
                                    <CustomButton
                                        className=" w-full p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 "
                                    >Delete feature</CustomButton>
                                </div>




                        </section>
                    ))}
                    <Button className={'py-2 bg-green-500 rounded-sm border-gray-400 border-2 hover:bg-green-600 mt-2'}
                            type={"button"}
                            onClick={() =>
                                setProductOptions({...productOptions, features:[...productOptions.features, {key:"", value:""}]})}>Add Feature</Button>
                </section>

                <Separator className={"bg-gray-400 my-3"}/>


                <section className={'flex items-center space-x-5'}>
                    <Checkbox checked={productOptions.active} onCheckedChange={()=>setProductOptions({...productOptions, active: !productOptions.active})}/>
                    <div>Set the product active, customers can see.</div>
                </section>

                <Separator className={"bg-gray-400 my-3"}/>
                <div className={'flex flex-row gap-2 '}> {/* flex-col для вертикального расположения кнопок */}
                    <CustomButton
                        type={"submit"}
                        className=" w-full p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 "
                    >
                        Add
                    </CustomButton>
                </div>
            </section>
        </form>
    );
});

export default ProductForm;
