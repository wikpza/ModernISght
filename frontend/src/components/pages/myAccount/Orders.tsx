import AccountLayout from "../../layout/AccountLayout.tsx";
import {useGetPayment} from "../../../api/PaymentAPI.tsx";
import OrderTotalCount from "./Order/OrderTotalCount.tsx";

const Orders = () => {
    const {payments, isLoading, error} = useGetPayment()

    if(payments && payments.payments.length === 0){
        return (
            <AccountLayout className={'w-full'}>
            <div>
            You haven't made any purchase
            </div>
            </AccountLayout>)
    }

    return (
        <AccountLayout className={'w-full'}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Orders</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load orders. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    {payments &&  payments.payments && payments.payments.map((payment, index)=>(
                        <OrderTotalCount payment={payment} key={index}/>
                    ))}
                </section>
            }
        </AccountLayout>
    );
};

export default Orders;