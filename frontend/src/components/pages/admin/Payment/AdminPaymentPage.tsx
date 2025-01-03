import AdminLayout from "../component/AdminLayout.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../ui/card.tsx";
import {Label} from "../../../ui/label.tsx";
import {Input} from "../../../ui/input.tsx";
import CustomCombobox from "../../../elements/ComboboxCustom.tsx";
import { paymentStatus, shippingStatus} from "../../../../lib/utils.ts";
import { useEffect, useState} from "react";
import {useGetPaymentsAdmin} from "../../../../api/AdminAPI.tsx";
import AdminPaymentTable from "./AdminPaymentTable.tsx";

const AdminPaymentPage = () => {
    const [params, setParams] = useState<{ page: number, limit: number, shippingStatus: string, status: string, searchId:string }>({
        page: 1,
        limit: 5,
        status: "",
        shippingStatus: "",
        searchId:""
    });

    const ChangeValueStatus = async (status:string)=>{
        setParams({...params, status:status})
    }
    const refreshDataStatus = async(status:string)=>{
        await ChangeValueStatus(status).then(()=>refetch())
    }

    const ChangeValueShipping = async (status:string)=>{
        setParams({...params, shippingStatus:status})
    }
    const refreshDataShipping = async(status:string)=>{
        await ChangeValueShipping(status).then(()=>refetch())
    }


    useEffect(() => {
        refetch()

    }, [params.page, params.searchId]);

    const { payments, isLoading, refetch, error } = useGetPaymentsAdmin(params);




    return (
        <div>
            <AdminLayout className={""}>
                {error && !isLoading ?
                    <section className={'flex-1 w-full'}>
                        <div className={'flex flex-row justify-between mb-2'}>
                            <h3 className={'text-2xl'}>Payments</h3>
                        </div>
                        <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}>
                            Unable to load Payments. Try to reload page.
                        </div>
                    </section>
                    :
                    <section className={'flex-1 w-full'}>
                        <Card className="max-w-[600px] mb-10 cardShadow">
                            <CardHeader>
                                <CardTitle className={'text-2xl'}>Payments</CardTitle>
                                <CardDescription>Set Params to find payments.</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form>
                                    <div className={'mb-5'}>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="name">Secret key</Label>
                                            <Input id="name" placeholder="input secret key" value={params.searchId}
                                                   onChange={(e) => setParams({...params, searchId: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className=" w-full gap-4 flex flex-col sm:flex-row ">

                                        <div className="flex flex-col space-y-1.5 w-full">
                                            <Label htmlFor="framework">Status</Label>
                                            <CustomCombobox
                                                listOfValue={paymentStatus}
                                                selectedName={{
                                                    name: params.status,
                                                    _id: params.status
                                                }}
                                                setName={async (val) => {
                                                    refreshDataStatus(val._id)

                                                }}
                                                optionName={"Status"}
                                            />
                                        </div>

                                        <div className="flex flex-col space-y-1.5 w-full font-sans">
                                            <Label htmlFor="framework">Shipping Status</Label>
                                            <CustomCombobox
                                                listOfValue={shippingStatus}
                                                selectedName={{
                                                    name: params.shippingStatus,
                                                    _id: params.shippingStatus
                                                }}
                                                setName={async (val) => {
                                                    refreshDataShipping(val._id)

                                                }}
                                                optionName={"Shipping Status"}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <AdminPaymentTable payments={payments} params={params} setParams={setParams}/>
                    </section>
                }
            </AdminLayout>
        </div>
    );
};

export default AdminPaymentPage;