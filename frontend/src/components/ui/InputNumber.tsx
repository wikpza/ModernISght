
import {InputOTP, InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,} from "./input-otp.tsx";

const InputNumber = () => {
    return (
        <InputOTP maxLength={9}>
            <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
            </InputOTPGroup>

            <InputOTPSeparator />

            <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot index={7} />
                <InputOTPSlot index={8} />
            </InputOTPGroup>
        </InputOTP>
    );
};

export default InputNumber;