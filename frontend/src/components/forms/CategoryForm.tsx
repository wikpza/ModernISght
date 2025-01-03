import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { Category} from "../../types.ts";
import {Form} from "../ui/form.tsx";
import CustomInput from "../ui/CustomInput.tsx";
import {Button} from "../ui/button.tsx";
import CustomButton from "../ui/CustomButton.tsx";


const formSchema = z.object({
    name: z.string().min(1, 'name  is required')
})

type CategoryFormData = z.infer<typeof formSchema>

type Props = {
    onSave: (CategoryFormData: Category)=>void,
    setOpen:(open:boolean)=>void,
    isLoading?:boolean,
    category?:Category,
    type?:'PATCH'|"POST"
}

const CategoryForm = ({onSave, setOpen,type="POST", category=
    {
        name:"",
        _id:''
    }
                        }:Props)=>{
    const form = useForm<CategoryFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:category
    })

    const onSubmit = (formDataJson: Category) => {
        if(category && type === 'PATCH'){
            formDataJson._id = category._id
        }
        onSave(formDataJson)

        setOpen(false)
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'rounded-lg md:p-5 space-y-4 text-gray-700 '}>

                <CustomInput name={'name'} label={'Name of the category'} form={form}/>

                <div className={'flex flex-row space-x-2 h-11'}>
                    <Button className={'w-full h-full rounded bg-white text-black border-2 border-gray-400 '} onClick={()=>{setOpen(false)}}>Cancel</Button>
                    <CustomButton type = {"submit"} className={'w-full h-full rounded '}><span className={'m-auto '}>Save</span></CustomButton>
                </div>


            </form>
        </Form>
    )
}


export default CategoryForm