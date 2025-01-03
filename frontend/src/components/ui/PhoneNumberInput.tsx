import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "./form.tsx";
import {Input} from "./input.tsx";
import {UseFormReturn} from "react-hook-form";
import React, {useState} from "react";


type Props = {
    name: string;
    form: UseFormReturn<any>;
};

const PhoneNumberInput: React.FC<Props> = ({ name, form }) => {
    const handlerPhoneNumberSubmit=(value)=> {
        const mask = "+996(___)__-__-__" // Новая маска

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
        const  newNumber = mask.replace(/_/g, () => numberArray.length ? numberArray.shift() : "_");
        form.setValue('phoneNumber', newNumber, {shouldValidate: true})
    }

    const [isFocused, setIsFocused ] = useState<boolean>(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        if (!form.getValues(name))  setIsFocused(false);
    }

   return (
        <FormField name={"phoneNumber"} control={form.control} render={({field}) =>
            <FormItem className={'flex-1 text-left relative space-y-0 font-sans'}>
                <FormLabel className={`absolute text-sm flex flex-row text-nowrap' ${isFocused || form.getValues(name) ? 'text-xs' :"text-sm"}`}
                           style={{
                               top: isFocused || form.getValues(name) ? '3px' : '25px',
                               color: isFocused || form.getValues(name) ? 'gray' : 'black',
                               fontWeight: isFocused || form.getValues(name) ? 'lighter' : '600',
                               transition: 'all 0.3s ease',
                               pointerEvents: "none"
                           }}
                > <span className={'text-red-500 mr-1'}>*</span> Phone number</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        className={'UserInput  border-gray-400 h-fit border w-full '}
                        style={{paddingTop: '25px', paddingBottom: '8px'}}
                        onChange={(e) => handlerPhoneNumberSubmit(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </FormControl>
                <FormMessage/>
            </FormItem>
        }/>
   );
};

export default PhoneNumberInput;