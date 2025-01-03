
import {Card, CardContent} from "../../../../ui/card.tsx";

import {Separator} from "../../../../ui/separator.tsx";
import CustomButton from "../../../../ui/CustomButton.tsx";
import SizeDialogForm from "./SizeDialogForm.tsx";
import {TiPlus} from "react-icons/ti";
import {useState} from "react";
import {Input} from "../../../../ui/input.tsx";
import {ImCross} from "react-icons/im";
import {toast} from "sonner";
import {useAddSize, useDeleteSizes} from "../../../../../api/SizesApi.tsx";
import {GetSizes} from "../../../../../types/size.type.ts";



type Props = {
    value?: GetSizes,
    id?:string
}
const SizeCart = ({value, id}:Props) => {

    const [showAddInput, setShowAddInput] = useState(false)
    const [addValue, setAddValue] = useState("")
    const {addSize, isSuccess:AddSizeIsSuccess} = useAddSize()
    const {deleteSizes, isSuccess:DeleteSizesIsSuccess} = useDeleteSizes()

    const submitAddSizeValue = ()=>{
        setAddValue(addValue.trim())
        if(addValue === ""){
            toast.error("you haven't input")
            return
        }
        addSize({newValue:addValue, id:id || ""})

    }


    if(DeleteSizesIsSuccess || AddSizeIsSuccess) location.reload()

    return (
        <Card className={'border-gray-400 border rounded max-w-[600px] min-w-[320px] flex-row m-2 flex-1'}>

            <CardContent className={'text-base text-black py-5 flex flex-col h-full '}>
                <div style={{backgroundColor: "#f1f1f1"}} className={'p-1 flex rounded w-[250px] max-h-[60px]'}>
                    <section
                        className={'border border-gray-500 rounded-md px-5 py-2 bg-white w-1/2 flex items-center justify-center'}>
                        {value?.genderId.name}
                    </section>
                    <section className={'flex items-center justify-center w-1/2'}>
                        {value?.categoryId.name}
                    </section>
                </div>
                <Separator className={"bg-gray-400 my-3"}/>

                <section  className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)',}}>
                    {value?.sizes && value?.sizes.map((size, index) => (
                        <SizeDialogForm id={value._id} sizeValue={size.size} key={index} sizeId={size._id} />
                    ))}

                    {!showAddInput &&
                        <div
                            className={'border-4 border-green-500 rounded m-1 cursor-pointer  hover:bg-green-500 transition-all'}>
                            <TiPlus className={'w-full h-full text-green-500 hover:text-white transition-all'}
                            onClick={()=>setShowAddInput(true)}/>
                        </div>
                    }

                </section>

                {showAddInput &&
                    <section className={'flex mt-3'}>
                        <div
                            className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">
                            {/* Компонент Input, обновляющий конкретное значение по индексу */}
                            <Input
                                placeholder={"input size"}
                                className={'border-none outline-0'}
                                value={addValue}
                                onChange={(e) => setAddValue(e.target.value)}
                            />
                        </div>

                        <div
                            className={'border-4 border-green-500 rounded  cursor-pointer  hover:bg-green-500 mx-2 transition-all'}
                            onClick={submitAddSizeValue}>
                            <TiPlus className={'w-full h-full text-green-500 hover:text-white transition-all  '}
                                    onClick={() => setShowAddInput(true)}/>
                        </div>

                        <div className={"border-4  rounded h-full w-auto  border-red-500 transition-all cursor-pointer p-1 hover:bg-red-500 "}
                             onClick={() => {
                                 setShowAddInput(false);
                                 setAddValue("")
                             }}>
                            <ImCross
                                className={'h-full w-full text-red-500  hover:text-white transition-all '}
                                style={{aspectRatio: " 1 / 1"}}
                               />
                        </div>

                    </section>}

                <Separator className={"bg-gray-400 my-3"}/>

                <div className={'flex flex-row gap-2 mt-auto'}>

                    <div onClick={()=>deleteSizes(id || "")}
                    className={"w-full"}>
                        <CustomButton
                            className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 w-full bg-blue-500"
                        >
                            Delete
                        </CustomButton>
                    </div>


                </div>
            </CardContent>
        </Card>
    );
};

export default SizeCart;