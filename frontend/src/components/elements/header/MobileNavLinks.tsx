import {useContext} from "react";
import {Context} from "../../../main.tsx";
import {navList} from "../../../lib/utils.ts";
import {useNavigate} from "react-router-dom";
import User from "../../SVG/User.tsx";


const MobileNavLinks = () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    return (
        <div className={'flex-row justify-between'}>
            <div className={'flex justify-center mb-5'}>
                {user && user.isAuth ?
                   <div className={'flex items-center'}>
                       <User className = {'mr-1'}/>
                       <div className={'text-black'}>
                           Hello {user.user?.firstName || user.user?.lastName || 'User'},
                           <br />My account
                       </div>
                   </div>
                    : <div className={'flex flex-row text-base font-medium text-black'}>
                        <User className={'mr-1'}/>

                        <span className={'block cursor-pointer hover:underline mr-1'} onClick={() => {
                            navigate('/user/login')
                            window.location.reload()
                        }}>Log in</span>
                        <span className={'font-sans'}>|</span>
                        <span className={'block cursor-pointer hover:underline ml-1'} onClick={() => {
                            navigate('/user/registration')
                            window.location.reload()
                        }}>Join</span>
                    </div>
                }
            </div>

            <ul className={'space-y-5 px-5'}>
                {navList.map((item, key) => (
                    <li
                        onClick={() => {
                            navigate(item.url)
                            window.location.reload()
                        } }
                        className={'text-base w-full border-b hover:border-red-700 hover:border-2  transition-all hover:bg-red-100 py-2 text-center border-gray-600 text-black bg-white'}
                        key={key}>{item.name}</li>
                ))}
                {(user.user.role === "admin" || user.user.role === "employer") && (
                    <li
                        onClick={() => {navigate("/admin")
                            window.location.reload()}}
                        className={'text-base w-full border-b hover:border-red-700 hover:border-2  transition-all hover:bg-red-100 py-2 text-center border-gray-600 text-black bg-white'}
                    >Admin</li>
                )}
            </ul>

            {user.isAuth ?
                <div className={'space-y-5 px-5 mt-5'}>
                    <div
                        onClick={() => {
                            user.resetUser()
                            window.location.reload()
                        }}
                        className={'text-base w-full border-b hover:border-red-700 hover:border-2  transition-all hover:bg-red-100 py-2 text-center border-gray-600 text-black bg-white'}
                    >Exit
                    </div>
                </div>
                :
                <div className={'space-y-5 px-5 mt-5'}>
                    <div
                        onClick={() => {
                            navigate("/user/login")
                            window.location.reload()
                        }}
                        className={'text-base w-full border-b hover:border-red-700 hover:border-2  transition-all hover:bg-red-100 py-2 text-center border-gray-600 text-black bg-white'}
                    >Log in | Join
                    </div>
                </div>

            }

        </div>
    );
};

export default MobileNavLinks;