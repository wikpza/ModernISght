import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu.tsx";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {Link, useNavigate} from "react-router-dom";
import {useState, useContext} from "react";
import User from "../../SVG/User.tsx";
import {Context} from "../../../main.tsx";
import {observer} from "mobx-react-lite";

const UsernameMenu = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const {user} = useContext(Context)

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={''}
        >
            <DropdownMenu open={isOpen}>
                <DropdownMenuTrigger className={'items-center font-medium text-sm cursor-pointer flex flex-row p-1'}>
                    <User className = {'mr-1'}/>
                    <div>
                        Hello {user.user?.firstName || user.user?.lastName || 'User'},
                        <br />My account
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className={'font-sm font-light border-b-1 border-gray-600'} style={{zIndex:'110'}}>
                    <DropdownMenuItem>
                        <Link to="/account/details" className={'hover:underline'}>My Account</Link>
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem onClick={()=>{
                        localStorage.setItem('token', "")
                        user.resetUser()
                        navigate('/')
                        window.location.reload()
                    }}>

                        <span className={'hover:underline'} >log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
})

export default UsernameMenu;
