
import UsernameMenu from "./UsernameMenu.tsx";
import User from "../../SVG/User.tsx";
import ControlPanel from "./ControlPanel.tsx";
import {useContext} from "react";
import {Context} from "../../../main.tsx";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";

const MainNav = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    return (
        <div className={'h-full'}>
            <div className={'flex flex-row justify-between items-center h-full'}>
                <ControlPanel/>
                <div className={'flex flex-row items-center h-full'}>
                    {user && user.isAuth?
                        <UsernameMenu/>
                        :<div className={'flex flex-row text-base font-medium'}>
                            <User className = {'mr-1'}/>

                            <span className={'block cursor-pointer hover:underline mr-1'}  onClick={()=> {
                                navigate('/user/login')
                                window.location.reload()

                            }}>Log in</span>
                            <span className={'font-sans'} >|</span>
                            <span className={'block cursor-pointer hover:underline ml-1'}  onClick={()=> {
                                navigate('/user/registration')
                                window.location.reload()
                            }} >Join</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
});

export default MainNav;