import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import CustomInput from "../ui/CustomInput.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form.tsx";
import {Input} from "../ui/input.tsx";
import {Button} from "../ui/button.tsx";
import CustomButton from "../ui/CustomButton.tsx";
import {User, UserInfo} from "@/types/user.type.ts";
import {handlerPhoneNumberSubmit} from "@/lib/utils.ts";


const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'second name is required'),
    updateValues:z.array(z.string()),
    phoneNumber: z.string().length(17,{message:"length must be 17"}).regex(/^\+\d{3}\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: "Phone number must be in the format +996(NNN)-NN-NN-NN"
    }),
})

type PersonalDetailFormData = z.infer<typeof formSchema>
export type PersonalDetailsFormData = {
    lastName:string,
    firstName:string,
    phoneNumber:string,
    updateValues:string[],

}
type Props = {
    onSave: (PersonalDetailsFormData: PersonalDetailsFormData)=> Promise<User>,
    setOpen:(open:boolean)=>void,
    isLoading?:boolean,
    userInfo: UserInfo | undefined
}



const PersonalDetailForm = ({onSave, setOpen, userInfo }:Props) => {



    const form = useForm<PersonalDetailFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lastName: userInfo?.lastName || "",
            firstName: userInfo?.firstName || "",
            phoneNumber: userInfo?.phoneNumber || "",
            updateValues: ['lastName', 'firstName', 'phoneNumber'],
        }
    });

    const onSubmit = async (formDataJson: PersonalDetailFormData) => {
        try {
            await onSave(formDataJson);  // Ожидаем выполнения onSave
            setOpen(false);  // Закрытие формы после успешного сохранения
        } catch (error) {
            console.error("Error during save:", error);
        }
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'rounded-lg md:p-5 space-y-4 text-gray-700 '}>

                <CustomInput name={'firstName'} label={'First Name'} form={form}/>
                <CustomInput name={'lastName'} label={'Last Name'} form={form}/>

                <FormField name={"phoneNumber"} control={form.control} render={({field}) =>
                    <FormItem className={'flex-1 text-left relative space-y-0 font-sans'}>
                        <FormLabel className={'absolute font-sm text-gray-400 flex flex-row'} style = {{top:"17px", left:"12px"}}>Phone number<span className={'text-red-500'}>*</span></FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                className={'CustomInput border-gray-400 h-fit border'}
                                style={{ paddingTop: "34px", paddingBottom: "8px" }}
                                onChange={(e)=>handlerPhoneNumberSubmit(e.target.value, form)}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>

                }/>

                <div className={'flex flex-row space-x-2 h-11'}>
                    <Button className={'w-full h-full rounded bg-white text-black border-2 border-gray-400 '} onClick={()=>{setOpen(false)}}>Cancel</Button>
                    <CustomButton type = {"submit"} className={'w-full h-full rounded '}><span className={'m-auto '}>Save</span></CustomButton>
                </div>


            </form>
        </Form>
    );
};

export default PersonalDetailForm;