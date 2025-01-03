import AdminLayout from "../component/AdminLayout.tsx";
import {useContext} from "react";
import {Context} from "../../../../main.tsx";
import AdminEmployerPage from "./AdminEmployerPage.tsx";


const AdminViewEmployerPage = () => {
    const {user} = useContext(Context)

    if(user.user.role === "employer"){
        return (
            <AdminLayout className={""}>
                You have not access
            </AdminLayout>
        )

    }

    return (
        <div>
            <AdminEmployerPage/>
        </div>
    );
};

export default AdminViewEmployerPage;