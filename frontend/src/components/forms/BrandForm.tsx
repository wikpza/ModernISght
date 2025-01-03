import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Brand} from "../../types.ts";
import {Form} from "../ui/form.tsx";
import CustomInput from "../ui/CustomInput.tsx";
import {Button} from "../ui/button.tsx";
import CustomButton from "../ui/CustomButton.tsx";


const formSchema = z.object({
    name: z.string().min(1, 'name  is required')
})

type BrandFormData = z.infer<typeof formSchema>

type Props = {
    onSave: (BrandFormData: Brand)=>void,
    setOpen:(open:boolean)=>void,
    isLoading?:boolean,
    brand?:Brand,
    type?:'PATCH'|"POST"
}

const BrandForm = ({onSave, setOpen,type="POST", brand=
    {
       name:"",
        _id:''
    }
                     }:Props)=>{
    const form = useForm<BrandFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:brand
    })

    const onSubmit = (formDataJson: Brand) => {
        if(brand && type === 'PATCH'){
            formDataJson._id = brand._id
        }
         onSave(formDataJson)

        setOpen(false)
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'rounded-lg md:p-5 space-y-4 text-gray-700 '}>

                <CustomInput name={'name'} label={'Name of the brand'} form={form}/>

                <div className={'flex flex-row space-x-2 h-11'}>
                    <Button className={'w-full h-full rounded bg-white text-black border-2 border-gray-400 '} onClick={()=>{setOpen(false)}}>Cancel</Button>
                    <CustomButton type = {"submit"} className={'w-full h-full rounded '}><span className={'m-auto '}>Save</span></CustomButton>
                </div>


            </form>
        </Form>
    )
}


export default BrandForm