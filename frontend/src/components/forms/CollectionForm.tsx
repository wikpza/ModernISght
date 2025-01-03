import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { Collection} from "../../types.ts";
import {Form} from "../ui/form.tsx";
import CustomInput from "../ui/CustomInput.tsx";
import {Button} from "../ui/button.tsx";
import CustomButton from "../ui/CustomButton.tsx";


const formSchema = z.object({
    name: z.string().min(1, 'name  is required')
})

type CollectionFormData = z.infer<typeof formSchema>

type Props = {
    onSave: (BrandFormData: Collection)=>void,
    setOpen:(open:boolean)=>void,
    isLoading?:boolean,
    collection?:Collection,
    type?:'PATCH'|"POST"
}

const CollectionForm = ({onSave, setOpen,type="POST", collection=
    {
        name:"",
        _id:''
    }
                   }:Props)=>{
    const form = useForm<CollectionFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:collection
    })

    const onSubmit = (formDataJson: Collection) => {
        if(collection && type === 'PATCH'){
            formDataJson._id = collection._id
        }
        onSave(formDataJson)

        setOpen(false)
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'rounded-lg md:p-5 space-y-4 text-gray-700 '}>

                <CustomInput name={'name'} label={'Name of the collection'} form={form}/>

                <div className={'flex flex-row space-x-2 h-11'}>
                    <Button className={'w-full h-full rounded bg-white text-black border-2 border-gray-400 '} onClick={()=>{setOpen(false)}}>Cancel</Button>
                    <CustomButton type = {"submit"} className={'w-full h-full rounded '}><span className={'m-auto '}>Save</span></CustomButton>
                </div>


            </form>
        </Form>
    )
}


export default CollectionForm