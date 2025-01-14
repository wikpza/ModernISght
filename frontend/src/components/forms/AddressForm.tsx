import {z} from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form.tsx";
import {Input} from "../ui/input.tsx";
import {Button} from "../ui/button.tsx";
import {Checkbox} from "../ui/checkbox.tsx";
import {Address} from "../../types.ts";
import CustomButton from "../ui/CustomButton.tsx";
import {useForm, UseFormReturn} from "react-hook-form";
import CustomAddressInput from "@/components/ui/CustomAddressInput.tsx";
import {mask} from "@/lib/utils.ts";
import LoadingOverlay from "@/components/ui/LoadingOveraly.tsx";


const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'second name is required'),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'city is required'),
    state: z.string().min(1, 'state is required'),
    zipCode: z.string().min(1, 'zip code is required'),
    phoneNumber: z.string().length(17,{message:"length must be 17"}).regex(/^\+\d{3}\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: "Phone number must be in the format +996(NNN)-NN-NN-NN"
    }),
    preferred: z.boolean(),
    _id: z.string(),
})

const handlerPhoneNumberSubmit=(value:string, form:UseFormReturn<AddressFormData>)=> {

    if (value.length === 1 && /^\d+$/.test(value.slice(0))) {
        form.setValue('phoneNumber', mask.replace("_", value), {shouldValidate: true})
        return
    }

    // Изменяем длину проверки на 18
    if(value.length === 18 && /^\d+$/.test(value.slice(-1))){
        form.setValue('phoneNumber', value.replace("_",  value.slice(-1)).slice(0, -1), {shouldValidate: true})
        return
    }

    if( value.length === 1 && !/^\d+$/.test(value.slice(0)) ){
        return
    }

    // Изменяем длину проверки на 18
    if( value.length === 18 && !/^\d+$/.test(value.slice(-1)) ){
        return
    }

    let numberArray = value.split('').slice(4,).filter((number)=>/^\d+$/.test(number))
    if(numberArray.length === 0){
        return
    }else if(numberArray.length < 9){
        numberArray = numberArray.slice(0,-1)
    }
    const newNumber = mask.replace(/_/g, () => numberArray.length ? numberArray.shift() || "" : "_");
    form.setValue('phoneNumber', newNumber, {shouldValidate: true})
}

export type AddressFormData = z.infer<typeof formSchema>

type Props = {
    onSave: (AddressFormData: Address)=>void,
    setOpen:(open:boolean)=>void,
    isLoading:boolean,
    address?:Address,
    type?:'PATCH'|"POST"
}

export const AddressForm = ({onSave, setOpen,type="POST", isLoading, address=
    {
        firstName:'',
        lastName:"",
        addressLine1:"",
        addressLine2:"",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        preferred:false,
        _id:''
    }
}:Props)=>{
    const form = useForm<AddressFormData>({
        resolver:zodResolver(formSchema),
        defaultValues:address
    })



    const onSubmit = (formDataJson: Address) => {
        console.log("User create new address")
        if(address && type === 'PATCH'){
            formDataJson._id = address._id
        }
        onSave(formDataJson);

        setOpen(false)
    };
    return (
        <LoadingOverlay isLoading={isLoading}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={'rounded-lg md:p-5 space-y-4 text-gray-700 '}>

                    <div className={'flex flex-row space-x-3 h-fit '}>
                        <CustomAddressInput name={'firstName'} label={'First Name'} form={form}/>
                        <CustomAddressInput name={'lastName'} label={'Last Name'} form={form}/>
                    </div>

                    <CustomAddressInput name={'addressLine1'} label={'Street address'} form={form}/>
                    <CustomAddressInput name={'addressLine2'} label={'Apartment, suite, etc. (optional)'} form={form}/>


                    <div className={'flex flex-row space-x-3'}>
                        <CustomAddressInput name={'city'} label={'City'} form={form}/>
                        <CustomAddressInput name={'state'} label={'State'} form={form}/>
                        <CustomAddressInput name={'zipCode'} label={'Zip code'} form={form}/>
                    </div>


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



                    <span className={'text-sm text-gray-500 font-light '}>Required for shipping related questions</span>

                    <div className={'flex flex-row items-center text-sm space-x-2 font-medium pt-5'}>
                        <FormField
                            control={form.control}
                            name="preferred"
                            render={() => (
                                <FormItem >
                                    <FormControl>
                                        <Checkbox className={'border-gray-400'} value = {"preferred"} checked ={form.getValues('preferred')}
                                        onCheckedChange={()=>{form.setValue("preferred",!form.getValues('preferred'))}}/>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <label>Set as preferred shipping method</label>
                    </div>


                    <div className={'flex flex-row space-x-2 h-11'}>
                        <Button className={'w-full h-full rounded bg-white text-black border-2 border-gray-400 '} onClick={()=>{setOpen(false)}}>Cancel</Button>
                        <CustomButton type = {"submit"} className={'w-full h-full rounded '}><span className={'m-auto '}>Save</span></CustomButton>
                    </div>


                </form>
            </Form>
        </LoadingOverlay>
    )
}


export default AddressForm