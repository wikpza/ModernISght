import Layout from "./components/layout/Layout.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {adminRoutes, publicRoutes, userRoutes} from "./auth/routes.ts";
import {useContext} from "react";
import {Context} from "./main.tsx";
import {jwtDecode} from "jwt-decode";
import User  from "./components/pages/User/User.tsx";
import {toast} from "sonner";
import {observer} from "mobx-react-lite";
import {runInAction} from "mobx";


let userData:{
    _id: string,
    lastName:string,
    firstName:string,
    email:string,
    role:string,
}
try{
    const token = localStorage.getItem('token');
    if(token)  userData = jwtDecode<{
        _id: string,
        lastName:string,
        firstName:string,
        email:string,
        role:string,
    }>(token)


}catch(error){
    toast.error("you are not authorized")
}



const AppRoutes =  observer( () => {

    const context = useContext(Context);

    if (!context) {
        throw new Error('Context is not available');
    }

    const {user} = context

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
    }

    return (
            <Routes>
                <Route path = {'*'} element={<Navigate  to={'/'}/>}/>
                <Route path = {'/user/login'} element={<Layout><User type={"login"}/></Layout>}/>
                <Route path = {'/user/registration'} element={<Layout><User type={"registration"}/></Layout>}/>

                {publicRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={<Layout> <route.Component/> </Layout>} />
                ))}

                {user.isAuth && userRoutes.map((route, index) => (
                    <Route key = {index} path = {route.path} element = {<Layout> <route.Component/> </Layout>}/>
                ))}

                {user.isAuth &&( userData?.role === 'admin' || userData?.role === 'employer') && adminRoutes.map((route, index) => (
                    <Route key = {index} path = {route.path} element = {<Layout> <route.Component/> </Layout>}/>
                ))}

            </Routes>
    );
})
export default AppRoutes;