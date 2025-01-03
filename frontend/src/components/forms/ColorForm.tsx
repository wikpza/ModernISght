import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { Color} from "../../types.ts";
import {Form} from "../ui/form.tsx";
import CustomInput from "../ui/CustomInput.tsx";
import {Button} from "../ui/button.tsx";
import CustomButton from "../ui/CustomButton.tsx";


const formSchema = z.object({
    name: z.string().min(1, 'name  is required'),
    hexCode: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, "Invalid Hex Code. Use #RRGGBB or #RGB.") // Регулярное выражение для проверки HEX-кода
})

type ColorFormData = z.infer<typeof formSchema>

type Props = {
    onSave: (ColorFormData: Brand)=>void,
    setOpen:(open:boolean)=>void,
    isLoading?:boolean,
    color?:Color,
    type?:'PATCH'|"POST"
}

const ColorForm = ({onSave, setOpen,type="POST", color =
    {
        name:"",
        hexCode:"",
        _id:''
    }
                   }:Props)=>{
    const form = useForm<ColorFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:color
    })

    const onSubmit = (formDataJson: Color) => {
        if(color && type === 'PATCH'){
            formDataJson._id = color._id
        }
        onSave(formDataJson)

        setOpen(false)
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'rounded-lg md:p-5 space-y-4 text-gray-700 '}>

                <CustomInput name={'name'} label={'Name of the color'} form={form}/>
                <CustomInput name={'hexCode'} label={'input Hex Code of color'} form={form}/>

                <div className={'flex flex-row space-x-2 h-11'}>
                    <Button className={'w-full h-full rounded bg-white text-black border-2 border-gray-400 '} onClick={()=>{setOpen(false)}}>Cancel</Button>
                    <CustomButton type = {"submit"} className={'w-full h-full rounded '}><span className={'m-auto '}>Save</span></CustomButton>
                </div>


            </form>
        </Form>
    )
}


export default ColorForm