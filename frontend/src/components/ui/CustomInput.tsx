import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "./form.tsx";
import {Input} from "./input.tsx";
import {UseFormReturn} from "react-hook-form";
import {PersonalDetailsFormData} from "@/components/forms/PersonalDetailForm.tsx";

// Типизация name для ограничений значений
type Props = {
    name: keyof PersonalDetailsFormData;
    label: string;
    form: UseFormReturn<PersonalDetailsFormData>;
    type?: string;
};

const layout = ({name, form, type, label}: Props) => {
    return (
        <FormField name={name} control={form.control} render={({field}) =>
            <FormItem className={'flex-1 text-left relative space-y-0'}>
                <FormLabel className={'absolute font-sm text-gray-400 flex flex-row text-nowrap font-sans'} style={{top:"17px", left:"12px"}}>
                    {label}
                    <span className={'text-red-500 font-sans'}>*</span>
                </FormLabel>
                <FormControl>
                    <Input type={type || 'text'} {...field} className={'CustomInput border-gray-400 h-fit border important:font-serif'} style={{paddingTop:"34px", paddingBottom:"8px"}}/>
                </FormControl>
                <FormMessage/>
            </FormItem>
        }/>
    );
};

export default layout;
