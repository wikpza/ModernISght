import  {useContext, useState} from 'react';
import { BsBoxSeam } from "react-icons/bs";
import LoginForms from "../../forms/LoginForms.tsx";
import RegistrationForms from "../../forms/RegistrationForms.tsx";
import {useCreateMyUser, useLoginMyUser} from "../../../api/MyUserApi.tsx";
import {Context} from "../../../main.tsx";
import VerifyEmail from "./VerifyEmail.tsx";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {runInAction} from "mobx";

type Props = {
    type?: 'login' | 'registration';
};


const User = observer( ({ type='login' }: Props) => {
    const [currentType, setCurrentType] = useState(type);
    const {createUser, isLoading:createUserLoading, isSuccess:isCreateUserSuccess, userSession} = useCreateMyUser()
    const {loginUser, isLoading:loginUserIsLoading, isSuccess:isLoginUserSuccess, userData} = useLoginMyUser()

    const context = useContext(Context);

    if (!context) {
        throw new Error('Context is not available');
    }

    const {user} = context

    const navigate = useNavigate()

    if(userSession) {

        return <VerifyEmail email={userSession?.email || "example@example.com"}></VerifyEmail>
    }

    if (userData) {
        runInAction(() => {
            user.setUser({
                _id: userData._id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
            });
            user.setIsAuth(true);
        });

        navigate('/');
    }


    return (
        <section className={'lg:max-w-[450px] lg:p-0 lg:ml-64 p-5 lg:py-4'}>
            <div>
                <div
                    className={'flex flex-row justify-center p-3 rounded bg-[#efefef] items-center text-base font-extrabold '}
                >
                    <BsBoxSeam className={'mr-2'} />
                    <span className={'pointer-events-none'}>Free shipping for members.</span>
                </div>

                <div className={'flex flex-row'}>
                    <button
                        className={`text-base font-extrabold flex justify-center items-center w-1/2 p-2 ${currentType === 'login' ? "border-b-4 border-red-600 text-red-600" : "border-b border-black"}`}
                        onClick={() => setCurrentType('login')}
                    >
                        Log in
                    </button>
                    <button
                        className={`flex justify-center items-center text-base font-bold w-1/2 p-2 ${currentType === 'registration' ? "border-b-4 border-red-600 text-red-600" : "border-b border-black"}`}
                        onClick={() => setCurrentType('registration')}
                    >
                        Create account
                    </button>
                </div>
                {currentType === 'login' && <LoginForms onSave={loginUser} changeType={()=>setCurrentType('registration')} isLoading={loginUserIsLoading} isSuccess={isLoginUserSuccess}/>}
                {currentType === 'registration' && <RegistrationForms  onSave={createUser} isLoading={createUserLoading} isSuccess={isCreateUserSuccess} changeType={()=>setCurrentType('login')}/>}
            </div>

        </section>
    );
})

export default User;
