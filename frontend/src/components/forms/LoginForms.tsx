
import {z} from 'zod'
import {UserLogIn} from "../../types.ts";
import {observer} from "mobx-react-lite";
import { useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLoading} from "../elements/header/LoadingOverlay.tsx";
import CustomButton from "../ui/CustomButton.tsx";
import {Form} from "../ui/form.tsx";
import UserInput from "../ui/UserInput.tsx";
const formSchema = z.object({
    email:z.string().email("Invalid email address").min(1, "Email is required"),
    password:z.string().min(8, 'Password must be at least 8 characters long')
})
type LoginFormData = z.infer<typeof formSchema>

type Props = {
    onSave:(LoginFormData:UserLogIn)=>void,
    isLoading?:boolean,
    changeType?:()=>void,
    isSuccess?:boolean
}
const LoginForm = observer(({onSave, isLoading = false,changeType}:Props) => {
    const form = useForm<LoginFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:
            {email:"",
            password: ""}
    })
    const {  startLoading, stopLoading, } = useLoading();
    const onSubmit = (formDataJson:UserLogIn)=>{
        onSave(formDataJson)
        if(isLoading){
            startLoading()
        }else{
            stopLoading()
        }

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={'space-y-5 py-5'}>
                    <UserInput name={'email'} label={'Email'} form={form}/>
                    <UserInput name={'password'} label={'Password'} form={form} type={'password'}/>
                </div>


                <CustomButton className={'w-full py-4'} type={'submit'}>
                    Login
                </CustomButton>

                <div className={'text-sm font-normal  mt-8'}>Don't have account? <span className={'underline font-semibold'} onClick={changeType}> Create Account</span> </div>
            </form>
        </Form>
    );
})

export default LoginForm;
