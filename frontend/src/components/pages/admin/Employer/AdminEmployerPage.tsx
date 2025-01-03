import AdminLayout from "../component/AdminLayout.tsx";
import { useEffect, useState } from "react";
import { useGetUsers } from "../../../../api/AdminAPI.tsx";
import EmployerTable from "./EmployerTable.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card.tsx";
import { Label } from "../../../ui/label.tsx";
import { Input } from "../../../ui/input.tsx";
import CustomCombobox from "../../../elements/ComboboxCustom.tsx";
import { capitalizeFirstLetter, userRole } from "../../../../lib/utils.ts";

const AdminEmployerPage = () => {
    const [params, setParams] = useState<{ page: number, limit: number, userRole: string, userEmail: string }>({
        page: 1,
        limit: 5,
        userRole: "employer",
        userEmail: ""
    });

    const ChangeValue = async (newRole:string)=>{
        setParams({...params, userRole:newRole})
    }
    const refreshData = async(newRole:string)=>{
        await ChangeValue(newRole).then(()=>refetch())
    }

    useEffect(() => {
        refetch()

    }, [params.page, params.userEmail]);

    const { users, isLoading, refetch, error } = useGetUsers(params);

    return (
        <div>
            <AdminLayout className={""}>
                {error && !isLoading ?
                    <section className={'flex-1 w-full'}>
                        <div className={'flex flex-row justify-between mb-2'}>
                            <h3 className={'text-2xl'}>Employers</h3>
                        </div>
                        <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}>
                            Unable to load employers. Try to reload page.
                        </div>
                    </section>
                    :
                    <section className={'flex-1 w-full'}>
                        <Card className="max-w-[600px] mb-10 cardShadow">
                            <CardHeader>
                                <CardTitle className={'text-2xl'}>Employer</CardTitle>
                                <CardDescription>Set Params to find user.</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form>
                                    <div className=" w-full gap-4 flex flex-col sm:flex-row ">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="name">Email</Label>
                                            <Input id="name" placeholder="Name of your project" value={params.userEmail} onChange={(e)=>setParams({...params, userEmail:e.target.value})}/>
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="framework">Role</Label>
                                            <CustomCombobox
                                                listOfValue={userRole}
                                                selectedName={{ name: capitalizeFirstLetter(params.userRole), _id: params.userRole }}
                                                setName={async (val) => {
                                                    refreshData(val._id)

                                                }}
                                                optionName={"Role"}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <EmployerTable users={users} params={params} setParams={setParams} />
                    </section>
                }
            </AdminLayout>
        </div>
    );
};

export default AdminEmployerPage;
