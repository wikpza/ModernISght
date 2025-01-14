import AddressDialogs from "../../dialogs/CreateAddressDialogs.tsx";
import {useGetUserAddresses} from "../../../api/UserAddressesApi.tsx";
import AddressesList from "../../elements/profileDetails/AddressesList.tsx";
import AccountLayout from "../../layout/AccountLayout.tsx";




const Address = () => {
    const {addresses, isLoading, error, refetch} = useGetUserAddresses()
    return (
        <AccountLayout className={'max-w-[500px] w-full min-w-[300px]'} >
                {error && !isLoading ?
                    <section className={'flex-1 w-full'}>
                        <div className={'flex flex-row justify-between mb-2'}>
                            <h3 className={'text-2xl'}>Addresses</h3>
                        </div>
                        <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                            load addresses. Try to
                            reload page.
                        </div>
                    </section>

                    :
                    <section className={'flex-1 w-full'}>
                        <div className={'flex flex-row justify-between mb-2'}>
                            <h3 className={'text-2xl'}>Addresses</h3>
                            <div><AddressDialogs refetch={refetch}/></div>
                        </div>
                        <AddressesList addresses={addresses} isLoading={isLoading} refetch={refetch}/>
                    </section>
                }
        </AccountLayout>
    )
        ;
};

export default Address;

