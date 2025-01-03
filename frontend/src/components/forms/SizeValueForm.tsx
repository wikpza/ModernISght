import { observer } from "mobx-react-lite";
import { useState} from "react";
import CustomButton from "../ui/CustomButton.tsx";
import {Separator} from "../ui/separator.tsx";
import {Input} from "../ui/input.tsx";
import {toast} from "sonner";
import {useDeleteSizeValue, useUpdateSizeValue} from "../../api/SizesApi.tsx";



type Props= {
    sizeValue?:string,
    id?:string,
    sizeId:string
}


const SizeValueForm = observer(({sizeValue, id, sizeId}:Props) => {





    const [newValue, setNewValue] = useState<string>(sizeValue || "");
    const {updateSizeValue, isSuccess:UpdateIsSuccess} = useUpdateSizeValue()
    const {deleteSizeValue, isSuccess:DeleteIsSuccess} = useDeleteSizeValue()


    const updateValue = () =>{
        setNewValue(newValue.trim())

        if(sizeValue === newValue){
            toast.error("you haven't changed value size")
            return
        }

        if(newValue === ""){
            toast.error("size can't be empty")
            return
        }
        updateSizeValue({sizeId:sizeId || "", newValue:newValue, id:id || ""})
    }

    if(UpdateIsSuccess || DeleteIsSuccess) window.location.reload();
    const deleteValue = () =>{
        deleteSizeValue({id :id || "", sizeId:sizeId || ""})
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };





    return (
        <form onSubmit={handleSubmit} className={'flex-1 h-full'}>
            <section
                className={'min-w-[250px] flex flex-col h-full'}> {/* Изменено на flex-col для вертикального размещения */}

                <div
                    className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 max-h-[46px] flex-1">

                    <Input
                        placeholder={"input size"}
                        className={'border-none'}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                </div>


                <Separator className={"bg-gray-400 my-3"}/>

                <div className={'flex flex-row gap-2 '}>
                    <div onClick={updateValue} className={'w-full'}>
                        <CustomButton className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 w-full">
                            Update
                        </CustomButton>
                    </div>



                    <div className={'w-full'} onClick={deleteValue}>
                        <CustomButton
                            className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer px-4 w-full"
                        >
                            Delete
                        </CustomButton>
                    </div>


                </div>

            </section>
        </form>
    );
});

export default SizeValueForm;
