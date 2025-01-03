import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../../ui/card.tsx";
import {Button} from "../../ui/button.tsx";
import {FaCheckCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useVerifyEmail} from "../../../api/MyUserApi.tsx";
import {MdError} from "react-icons/md";
import {useContext} from "react";
import {Context} from "../../../main.tsx";

const ReportVerifyEmail = () => {
    const navigate = useNavigate()

    const url = window.location.href
    const segments = url.split('/');
    const id = segments.pop();

    const {userData, isSuccess, isLoading,  isError} = useVerifyEmail(id)

    const {user} = useContext(Context)
    if (userData) {
        user.setUser({
            _id: userData._id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
        });
        user.setIsAuth(true);
    }
    if(isLoading) return <div>loading ... </div>

    return (
        <Card className={'mx-auto max-w-[520px] mt-6 border-black'} >
            <CardHeader>
                <FaCheckCircle style={{color:"green", fontSize:"150px"}} className={'mx-auto'}/>
                {/*{isSuccess && <FaCheckCircle style={{color:"green", fontSize:"150px"}} className={'mx-auto'}/> }*/}
                {isError && <MdError style={{color:"red", fontSize:"150px"}} className={'mx-auto'} />}
                <CardTitle className={'text-center text-2xl'}>Verify Your Email</CardTitle>
            </CardHeader>
            <CardContent>
                {isSuccess &&
                    <p className={'text-center text-base'}>You have successfully verified your email. You can now enjoy
                        all the features of our service. Thank you for choosing us!</p>}
                {isError && <p className={'text-center text-base'} > An error occurred, or your link is no longer valid. Please try again.</p>}
            </CardContent>
            <CardFooter className={'flex justify-center'}>
                <Button className={' bg-blue-500 p-5'} onClick={()=>navigate('/')}>
                    Return to Home page
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ReportVerifyEmail;