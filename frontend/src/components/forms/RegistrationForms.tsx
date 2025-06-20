import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormMessage} from "../ui/form.tsx";
import UserInput from "../ui/UserInput.tsx";
import {Checkbox} from "../ui/checkbox.tsx";
import CustomButton from "../ui/CustomButton.tsx";
import {Link} from "react-router-dom";
import {UserRegistration} from "../../types.ts";
import {useLoading} from "../elements/header/LoadingOverlay.tsx";
import {observer} from "mobx-react-lite";
import PhoneNumberInput from "../ui/PhoneNumberInput.tsx";



const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&]).{8,}$/;
const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Second name is required'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(passwordRegex, 'Password must contain at least one capital letter, one number, and one special character (! @ # $ % &)'),
    sentInfo:z.boolean(),
    confirmedRules:z.literal(true,{message:"To continue, please check the box."}),
    phoneNumber: z.string().length(17,{message:"length must be 18"}).regex(/^\+\d{3}\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: "Phone number must be in the format +996(NNN)-NN-NN-NN"
    }),
})

type RegistrationFormData = z.infer<typeof formSchema>

type Props = {
    onSave:(RegistrationFormData:UserRegistration)=>void,
    isLoading?:boolean,
    changeType?:()=>void,
    isSuccess?:boolean
}
const RegistrationForms = observer(({onSave, isLoading = false,changeType}:Props) => {
    const form = useForm<RegistrationFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:
            { firstName:"",
            lastName:"",
            email:"",
            password:"",
            sentInfo:false,
                phoneNumber: ""
        }
    })




    const {  startLoading, stopLoading, } = useLoading();
    const onSubmit = (formDataJson:UserRegistration)=>{
        onSave(formDataJson)
        // if(isLoading){
        //     startLoading()
        // }else{
        //     stopLoading()
        // }

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={'space-y-5 py-5'}>
                    <UserInput name={'firstName'} label={'First Name'} form={form}/>
                    <UserInput name={'lastName'} label={'Last name'} form={form}/>
                    <PhoneNumberInput name={"phoneNumber"} form={form}/>
                    <UserInput name={'email'} label={'Email'} form={form}/>
                    <UserInput name={'password'} label={'Password'} form={form} type={'password'}/>
                </div>

                <section className={'text-xs font-light'}>
                    <span className={'block mb-3'}>Password requirements:</span>
                    <ul style={{listStyleType: "disc"}} className={'ml-2'}>
                        <li>Minimum 8 characters</li>
                        <li>At least one capital letter</li>
                        <li>At least one number</li>
                        <li>At least one special character (! @ # $ % &)</li>
                    </ul>
                </section>

                <section className={'space-y-3 py-3 px-3'}>
                    <FormField
                        control={form.control}
                        name="sentInfo"
                        render={() => (
                            <FormItem>
                                <div className={'flex flex-row items-center'}>
                                    <FormControl>
                                        <Checkbox className={'border-gray-400'} value={form.getValues('sentInfo')}
                                                  checked={form.getValues('sentInfo')}
                                                  onCheckedChange={() => {
                                                      form.setValue("sentInfo", !form.getValues('sentInfo'))
                                                  }}/>
                                    </FormControl>
                                    <span className={'ml-2 text-sm font-medium'}>Sign up for email to hear about product launches, exclusive offers and athlete news</span>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmedRules"
                        render={() => (
                            <FormItem >
                                <div className={'flex flex-row items-center'}>
                                    <FormControl>
                                        <Checkbox className={'border-gray-400'} value={form.getValues('confirmedRules')}
                                                  checked={form.getValues('confirmedRules')}
                                                  onCheckedChange={() => {
                                                      form.setValue("confirmedRules", !form.getValues('confirmedRules'))
                                                  }}/>
                                    </FormControl>
                                    <span className={'text-sm font-light ml-2'}>By checking the box, you are creating an account with New Balance and you agree to the <Link
                                        className={'underline  font-semibold'} to={'#'}>Terms & Conditions</Link> and <Link
                                        className={'underline font-semibold'}>Privacy Policy</Link>.</span>
                                </div>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                </section>
                <CustomButton className={'w-full py-4'} type={'submit'}>
                    Create Account
                </CustomButton>

                <div className={'text-sm font-normal  mt-8'}>Already have an account? <span className={'underline font-semibold'} onClick={changeType}> Log in</span> </div>
            </form>
        </Form>
    );
})

export default RegistrationForms;