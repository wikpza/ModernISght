import {useEffect} from "react";
import {z} from "zod";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLoading} from "../elements/header/LoadingOverlay.tsx";
import CustomButton from "../ui/CustomButton.tsx";
import {Form} from "../ui/form.tsx";
import UserInput from "../ui/UserInput.tsx";
import {UserLogIn} from "@/types/user.type.ts";
import {FormErrors, isFormErrors} from "@/lib/utils.ts";
import LoadingOverlay from "@/components/ui/LoadingOveraly.tsx";
import {toast} from "sonner";

const formSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});
type LoginFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (LoginFormData: UserLogIn) => void;
    isLoading: boolean;
    changeType: () => void;
    response: { message: string } | FormErrors | undefined;
    status: number | undefined;

};

const LoginForm = observer(({onSave, isLoading = false, changeType, response, status}: Props) => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const {startLoading, stopLoading} = useLoading();

    const onSubmit = (formDataJson: UserLogIn) => {
        onSave(formDataJson);
        if (isLoading) {
            startLoading();
        } else {
            stopLoading();
        }
    };

    useEffect(() => {
        if (response && isFormErrors(response) && status && status >=400 && status < 500) {

            if ("email" in response.details) {
                form.setError("email", {
                    type: "manual",
                    message: response.details.email.join(","),
                });
            }else{
                toast.error(response.message)
            }


        }
    }, [response, status, form]);

    return (
        <LoadingOverlay isLoading={isLoading}>


        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={"space-y-5 py-5"}>
                    <UserInput name={"email"} label={"Email"} form={form} />
                    <UserInput name={"password"} label={"Password"} form={form} type={"password"} />
                </div>

                <CustomButton className={"w-full py-4"} type={"submit"}>
                    Login
                </CustomButton>

                <div className={"text-sm font-normal mt-8"}>
                    Don't have account?{" "}
                    <span className={"underline font-semibold"} onClick={changeType}>
                        Create Account
                    </span>
                </div>
            </form>
        </Form>

        </LoadingOverlay>
    );
});

export default LoginForm;
