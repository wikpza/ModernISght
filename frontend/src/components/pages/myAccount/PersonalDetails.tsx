import AccountLayout from "../../layout/AccountLayout.tsx";
import DetailsCart from "../../elements/profileDetails/DetailsCart.tsx";
import  {useContext} from "react";
import {Context} from "../../../main.tsx";
import ChangePersonalDetails from "../../dialogs/changePersonalDetails.tsx";
import EditPasswordDialog from "../../dialogs/EditPasswordDialog.tsx";



const PersonalDetails = () => {
    const {user} = useContext(Context)
    return (
        <AccountLayout className={'max-w-[500px] w-full min-w-[300px] space-y-3'}>
                <div className={'text-2xl font-semibold'}>Personal Details</div>
                <DetailsCart editButton={<ChangePersonalDetails/>} title={"Details"} value={`${user.user.lastName} ${user.user.firstName}`} isPassword={false}/>
                <DetailsCart editButton=
                                 {
                                    <button disabled={true} className={'text-center py-1 px-4 bg-gray-300 text-gray-400 border rounded border-gray-400 block'}>
                                        Edit
                                    </button>
                                    } title={"Login email"} value={user.user.email} isPassword={false}/>

            <DetailsCart editButton={<EditPasswordDialog/>} title={"Password"} value={"password"} isPassword={true}/>

        </AccountLayout>
    );
};

export default PersonalDetails;