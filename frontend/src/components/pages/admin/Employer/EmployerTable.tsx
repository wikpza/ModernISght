import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../../../ui/table.tsx";
import ResponsivePaginationComponent from "react-responsive-pagination";
import {GetEmployer} from "../../../../types/user.type.ts";
import CustomCombobox from "../../../elements/ComboboxCustom.tsx";
import {capitalizeFirstLetter, userRole} from "../../../../lib/utils.ts";
import {Card} from "../../../ui/card.tsx";
import {useUpdateUserRole} from "../../../../api/AdminAPI.tsx";
import {useContext} from "react";
import {Context} from "../../../../main.tsx";

type Props = {
    users:GetEmployer | undefined,
    params:{page:number, limit:number, userRole:string, userEmail:string},
    setParams:(input:{page:number, limit:number, userRole:string, userEmail:string})=>void
}
const EmployerTable = ({users, params, setParams}:Props) => {
    const {user} = useContext(Context)
    const {updateRole, isSuccess} = useUpdateUserRole()
    if (isSuccess) window.location.reload()
    return (
        <div>

            { (users && users.user.length !== 0) ?
                (
            <div>
                <Card className={'max-w-[700px] p-5 cardShadow'}>
                    <section>
                        <Table>
                            <TableCaption>A list of your recent invoices.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>phoneNumber</TableHead>
                                    <TableHead>role</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.user.map((item, index) => {

                                    if(user.user._id !== item._id){
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{`${item.lastName} ${item.firstName}`}</TableCell>
                                                <TableCell>{item.email}</TableCell>
                                                <TableCell>{item.phoneNumber}</TableCell>
                                                <TableCell>
                                                    <CustomCombobox listOfValue={userRole} selectedName={{
                                                        name: capitalizeFirstLetter(item.role),
                                                        _id: item.role
                                                    }} setName={(val) => {
                                                        if(item.role !== val._id ) updateRole({userId:item._id, newRole:val._id})
                                                    } } optionName={"Role"}/>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }


                                    }
                                )}
                            </TableBody>
                        </Table>

                    </section>

                    <section>
                        <ResponsivePaginationComponent
                            current={params.page}
                            total={users ? users.totalPage : 10}
                            onPageChange={(newPage) => setParams({
                                ...params,
                                page: newPage
                            })} // Обновляем страницу при смене страницы
                        />
                    </section>

                </Card>


            </div>
                )
                :
                (<div className={'mt-5'}>
                    You haven't added any employer
                </div>)}


        </div>
    );
};

export default EmployerTable;