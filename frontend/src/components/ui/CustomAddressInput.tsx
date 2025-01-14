import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form.tsx";
import { UseFormReturn } from "react-hook-form";
import { AddressFormData } from "@/components/forms/AddressForm.tsx";
import { Input } from "./input.tsx";

// Типизация name для ограничений значений
type Props = {
    name: keyof AddressFormData;
    label: string;
    form: UseFormReturn<AddressFormData>;
    type?: string;
};

const Layout = ({ name, form, type, label }: Props) => {
    return (
        <FormField
            name={name}
            control={form.control}
            render={({ field }) => (
                <FormItem className="flex-1 text-left relative space-y-0">
                    <FormLabel
                        className="absolute font-sm text-gray-400 flex flex-row text-nowrap font-sans"
                        style={{ top: "17px", left: "12px" }}
                    >
                        {label}
                        <span className="text-red-500 font-sans">*</span>
                    </FormLabel>
                    <FormControl>
                        <Input
                            type={type || "text"}
                            {...field}
                            value={typeof field.value === "boolean" ? String(field.value) : field.value}
                            className="CustomInput border-gray-400 h-fit border important:font-serif"
                            style={{ paddingTop: "34px", paddingBottom: "8px" }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default Layout;
