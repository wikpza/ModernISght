import {useNavigate} from "react-router-dom";
import {navList} from "../../../lib/utils.ts";
import {useContext} from "react";
import {Context} from "../../../main.tsx";

const ControlPanel = () => {
    const {user} = useContext(Context)

    const navigate = useNavigate()
    return (
        <ul className={'mx-auto flex space-x-5 h-full'}>
            {navList.map((value, key)=> (
                <li className={'  flex items-center cursor-pointer'} key={key}
                    onClick={() => {
                        navigate(value.url)
                        window.location.reload()
                    }}>
                    <div className={"border-red-700 hover:border-b-2 transition-all"}>{value.name}</div>
                </li>
            ))}

            {user.isAuth && (user.user.role === "admin" || user.user.role === "employer") &&
                <li className={'  flex items-center cursor-pointer'}
                    onClick={() => {
                        navigate("/admin/product")
                        window.location.reload()
                    }}>
                    <div className={"border-red-700 hover:border-b-2 transition-all"}>Admin</div>
                </li>}


        </ul>
    );
};

export default ControlPanel;