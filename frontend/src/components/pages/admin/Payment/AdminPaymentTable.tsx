import {GetAdminPayments} from "../../../../types/payments.type.ts";
import {Card} from "../../../ui/card.tsx";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../../../ui/table.tsx";

import ResponsivePaginationComponent from "react-responsive-pagination";
import {ScrollArea, ScrollBar} from "../../../ui/scroll-area.tsx";
import {useChangeShippingStatus, useChangeStatus} from "../../../../api/PaymentAPI.tsx";
import CustomCombobox from "../../../elements/ComboboxCustom.tsx";
import { paymentStatus, shippingStatus} from "../../../../lib/utils.ts";



type Props = {
    payments:GetAdminPayments | undefined,
    params:{page:number, limit:number, shippingStatus:string, status:string, searchId:string},
    setParams:(input:{page:number, limit:number, shippingStatus:string, status:string, searchId:string})=>void
}
const AdminPaymentTable = ({payments, params, setParams}:Props) => {
    const {updateStatus, isSuccess} = useChangeStatus()
    const {updateShippingStatus, isSuccess:isShippingStatusSuccess} = useChangeShippingStatus()
    if(isSuccess || isShippingStatusSuccess) window.location.reload()
    return (
        <div>

            {(payments && payments.data.length !== 0) ?
                (
                    <div>
                        <ScrollArea className="max-w-[900px] whitespace-nowrap rounded-md border">
                            <Card className={'w-full p-5 cardShadow'}>
                                <section>
                                    <Table>
                                        <TableCaption>A list of your recent invoices.</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>key</TableHead>


                                                <TableHead>Product price</TableHead>
                                                <TableHead>Shipping price</TableHead>
                                                <TableHead>Total Price</TableHead>
                                                <TableHead className={'text-center'}>Shipping Status</TableHead>
                                                <TableHead className={'text-center'}>status</TableHead>


                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payments?.data.map((item, index) =>
                                                <TableRow key={index}>
                                                    <TableCell>{item.key}</TableCell>


                                                    <TableCell className={'text-center'}>{item.productPrice}</TableCell>
                                                    <TableCell className={'text-center'}>{item.shippingPrice}</TableCell>
                                                    <TableCell className={'text-center'}>{item.totalPrice}</TableCell>

                                                    <TableCell  className={`font-sans ${(item.shippingStatus === 'finished' || item.shippingStatus === "picked up") && "!text-green-600"} text-yellow-500`}>
                                                        {
                                                            (item.shippingStatus === "in process" || item.shippingStatus === "self-pickup")?
                                                                <CustomCombobox listOfValue={shippingStatus}  selectedName={{
                                                                    name: item.shippingStatus,
                                                                    _id: item.shippingStatus
                                                                }} setName={(val) => {
                                                                    if(item.shippingStatus !== val._id ) updateShippingStatus({paymentId:item._id, status:val._id})
                                                                } } optionName={"Role"}/>
                                                                :
                                                                <span>{item.shippingStatus}</span>
                                                        }


                                                    </TableCell>

                                                    <TableCell className={` ${item.status === 'succeeded' && "text-green-600"} ${item.status === 'returned' && "text-red-500"}`}>
                                                        {item.status === "succeeded"?
                                                            <CustomCombobox listOfValue={paymentStatus} selectedName={{
                                                                name: item.status,
                                                                _id: item.status
                                                            }} setName={(val) => {
                                                                if(item.status !== val._id ) updateStatus({paymentId:item._id, status:val._id})
                                                            } } optionName={"Status"}/>
                                                        :
                                                        <span>{item.status}</span>}

                                                    </TableCell>


                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                </section>


                            </Card>
                            <ScrollBar orientation="horizontal"/>
                        </ScrollArea>
                        <section className={'mt-5'}>
                            <ResponsivePaginationComponent
                                current={params.page}
                                total={payments ? payments.totalPage : 10}
                                onPageChange={(newPage) => setParams({
                                    ...params,
                                    page: newPage
                                })} // Обновляем страницу при смене страницы
                            />
                        </section>


                    </div>
                )
                :
                (<div className={'mt-5'}>
                    You haven't added payments with such params
                </div>)}


        </div>
    );
};

export default AdminPaymentTable;