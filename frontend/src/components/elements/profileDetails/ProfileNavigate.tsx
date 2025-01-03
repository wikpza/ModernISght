import React from "react";
import {useNavigate} from "react-router-dom";
import {FaCircleNotch} from "react-icons/fa";


type Props = {
    svg?:React.ReactNode,
    title:string,
    isActivated:boolean,
    value:string,
    navigateTo?:string
}

const ProfileNavigate = ({svg, title, isActivated, value, navigateTo = "account"}:Props) => {

    if(!svg) svg = <FaCircleNotch />

    const navigate = useNavigate()
    return (
        <div className={`cursor-pointer text-gray-700 hover:text-gray-950 flex 
        flex-row py-3 
        px-3 
        lg:w-56 hover:text-gray-600
       w-fit
        border-gray-500 border rounded-md 
        items-center
        ${isActivated?'border-gray-950 border-2 rounded-md addShadow ':'lg:border-none'}`}
        onClick={()=> navigate(`/${navigateTo}/${value}`)}>
            {svg}<div className={'ml-2 text-base text-nowrap  '}>{title}</div>
        </div>
    );
};

export default ProfileNavigate;

