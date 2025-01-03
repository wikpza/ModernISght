import AdminLayout from "../component/AdminLayout.tsx";
import {useContext} from "react";
import {Context} from "../../../../main.tsx";
import PaymentStatisticGrapth from "./component/PaymentStatisticGrapth.tsx";

const AdminStatisticPage = () => {
    const {user} = useContext(Context)
    if(user.user.role !== "admin"){
        return (
            <AdminLayout className={''}>
                You don't have enough rights
            </AdminLayout>
        );
    }

    return (
        <AdminLayout className={'w-full'}>
            <PaymentStatisticGrapth/>
        </AdminLayout>
    );
};

export default AdminStatisticPage;