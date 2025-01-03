import {useGetUsersRoleStatic} from "../../../../../api/AdminAPI.tsx";
import UserStaticRoleGraph from "./UserStaticRoleGraph.tsx";
import UserUnverifyStatic from "./UserUnverifyStatic.tsx";

const UserRoleStatic = () => {
    const { users, isLoading } = useGetUsersRoleStatic();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if ( !users) {
        return <div>Error loading user data</div>;
    }


    return (
        <div className={'flex p-5 w-full '}>
                <UserStaticRoleGraph userNumber={users.userNumber} adminNumber={users.adminNumber} employerNumber={users.employerNumber}/>
                <UserUnverifyStatic userNumber={users.userNumber} unVerifyUser={users.unVerifyUser}/>
        </div>
    );
};

export default UserRoleStatic;