import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../../ui/card.tsx";

import {Button} from "../../ui/button.tsx";
import { useNavigate } from "react-router-dom";
import {MdMarkEmailUnread} from "react-icons/md";
type Props = {
    email: string;
};

const VerifyEmailPassword = ({email="example@examplegmail.com"}:Props) => {
    const navigate = useNavigate()
    return (
        <Card className={'mx-auto max-w-[520px] mt-6 border-black'} >
            <CardHeader>
                <MdMarkEmailUnread style={{color:"blue", fontSize:"150px"}} className={'mx-auto'}/>
                <CardTitle className={'text-center text-2xl'}>Verify Your Email</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={'text-center text-base'}>A link to reset your password has been sent to your email. <span className={'font-bold'}>{email}</span> </p>
            </CardContent>
            <CardFooter className={'flex justify-center' }>
                <Button className={' bg-blue-500 p-5'} onClick={()=>navigate('/')}>
                    Return to Home page
                </Button>
            </CardFooter>
        </Card>
    );
};

export default VerifyEmailPassword;