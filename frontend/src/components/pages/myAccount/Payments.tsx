import AccountLayout from "../../layout/AccountLayout.tsx";
import {useGetCards} from "../../../api/CardAPI.tsx";
import CreatePaymentsDialog from "./Payments/CreatePaymentsDialog.tsx";
import CardList from "./Payments/CardList.tsx";

const Payments = () => {
    const {cards, error, isLoading, refetch} = useGetCards()

    return (
        <AccountLayout className={'w-full'}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Payments</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load Payments. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'w-full flex-1'}>
                    <div className={'flex flex-row justify-between mb-2 w-full flex-1'}>
                        <h3 className={'text-2xl'}>Cards</h3>
                        <div><CreatePaymentsDialog refetch={refetch}/></div>
                    </div>
                    <CardList cards={cards} isLoading={isLoading} refetch={refetch}/>
                </section>
            }
        </AccountLayout>
    );
};

export default Payments;