import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form.tsx';
import { UseFormReturn } from 'react-hook-form';

type Props = {
    name: string;
    label: string;
    form: UseFormReturn<any>;
    type?: string;
};

const Layout: React.FC<Props> = ({ name, form, type, label }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    return (
        <FormField name={name} control={form.control} render={({ field }) => (
            <FormItem className={'flex-1 text-left relative space-y-0'}>
                <FormLabel
                    className={`absolute text-sm flex flex-row text-nowrap' ${isFocused || form.getValues(name) ? 'text-xs' :"text-sm"}`}
                    style={{
                        top: isFocused || form.getValues(name) ? '3px' : '25px',
                        color: isFocused  || form.getValues(name) ? 'gray' : 'black',
                        fontWeight:isFocused  || form.getValues(name) ? 'lighter' : '600',
                        transition: 'all 0.3s ease',
                        pointerEvents:"none"
                    }}
                >
                    <span className={'text-red-500 mr-1'}>*</span> {label}
                </FormLabel>
                <FormControl>
                    <div className="">
                        <input
                            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                            {...field}
                            className={'UserInput  w-full '}
                            style={{paddingTop: '25px', paddingBottom: '8px'}}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />

                        {type === 'password' && (
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-6 underline text-sm"
                                style={{cursor: 'pointer', background: 'none', border: 'none',
                                }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        )}
                    </div>
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
    );
};

export default Layout;
