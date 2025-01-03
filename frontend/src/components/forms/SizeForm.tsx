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
import {useCreateSizes} from "../../api/SizesApi.tsx";
import {ImCross} from "react-icons/im";




const validInputValues = (gender:{name:string, _id:string}, category:{name:string, _id:string}, values:string[])=>{

    if (category._id === "") {
        toast.error("Please select a category.");
        return false
    }

    if (gender._id === "") {
        toast.error("Please select a gender.");
        return false
    }

    if(values.length===0){
        toast.error('input the size')
        return false
    }

    if(new Set(values).size !== values.length){
        toast.error('can not input unique values')
        return false
    }
    return true
};

const SizeListForm = observer(() => {


    const { categories, isLoading:categoriesIsLoading } = useGetCategories();
    const {genders, isLoading:genderIsLoading} = useGetGenders()

    const {createSize, isSuccess} = useCreateSizes()
    const [sizeValues, setSizeValues] = useState<string[]>([""]);



    const [category, setCategory] = useState<{name:string, _id:string}>({name:"", _id:""});
    const [gender, setGender] = useState<{name:string, _id:string}>({name:"", _id:""});



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSizeValues(sizeValues.map(item => item.trim()))
        setSizeValues(sizeValues.filter(item => item !== ''))

        if (validInputValues(gender, category, sizeValues)) {
            createSize(
                {
                    genderId: gender._id,
                    categoryId: category._id,
                    values: sizeValues
                }
            )
        }



    };

    if(isSuccess){
        toast.success('Size successfully added')
        window.location.reload()
    }





    return (
        <form onSubmit={handleSubmit} className={'flex-1 h-full '}>
            <section
                className={'min-w-[250px] flex flex-col h-full'}> {/* Изменено на flex-col для вертикального размещения */}

                <div style={{backgroundColor: "#f1f1f1"}} className={'p-1 rounded space-y-2'}>
                    <section
                        className={'border border-gray-400 rounded-md px-5 py-2 bg-white flex items-center justify-center'}>
                        {!categoriesIsLoading && categories &&
                            <CustomCombobox listOfValue={categories} selectedName={category} setName={setCategory}
                                            optionName={"Category"}/>
                        }
                    </section>

                    <section
                        className={'border border-gray-400 rounded-md px-5 py-2 bg-white flex items-center justify-center'}>
                        {!genderIsLoading && genders &&
                            <CustomCombobox listOfValue={genders} selectedName={gender} setName={setGender}
                                            optionName={"Gender"}/>
                        }
                    </section>
                </div>

                <Separator className={"bg-gray-400 my-3"}/>

                <section className="grid gap-2" >
                    {sizeValues && sizeValues?.map((sizeValue, index) => (
                        <section className={'flex '} key={index}>
                            <div key={index}
                                 className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                                {/* Компонент Input, обновляющий конкретное значение по индексу */}
                                <Input
                                    placeholder={"input size"}
                                    className={'border-none'}
                                    value={sizeValue}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSizeValues(sizeValues.map((inputSize, inputIndex) =>
                                            inputIndex === index ? newValue : inputSize
                                        ));
                                    }}
                                />
                            </div>


                            <div
                                className={"border-4  rounded h-full w-auto  border-red-500 transition-all cursor-pointer p-1 hover:bg-red-500 "}>

                                <ImCross
                                    className={'h-full w-full text-red-500  hover:text-white transition-all '}

                                    style={{aspectRatio: " 1 / 1"}}
                                    onClick={() => setSizeValues(sizeValues.filter((_, i) => i !== index))}/>
                            </div>


                        </section>
                    ))}
                    <Button className={'py-2 bg-green-500 rounded-sm border-gray-400 border-2 hover:bg-green-600 mt-2'}
                            type={"button"}
                            onClick={() => setSizeValues([...sizeValues, ""])}>Add Size</Button>
                </section>


                <Separator className={"bg-gray-400 my-3"}/>
                <div className={'flex flex-row gap-2 mt-auto'}> {/* flex-col для вертикального расположения кнопок */}
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

export default SizeListForm;
