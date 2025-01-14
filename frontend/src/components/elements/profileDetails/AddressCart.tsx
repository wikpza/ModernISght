import {Card, CardContent, CardFooter, CardHeader} from "../../ui/card.tsx";
import {Address} from "../../../types.ts";
import {Separator} from "../../ui/separator.tsx";
import {GoTrash} from "react-icons/go";
import EditAddressDialogs from "../../dialogs/EditAddressDialogs.tsx";
import {useDeleteUserAddresses, useSetPreferredUserAddresses} from "../../../api/UserAddressesApi.tsx";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {useEffect} from "react";


type Props = {
    address?: Address,
    refetch: <TPageData>(options?: ((RefetchOptions & RefetchQueryFilters<TPageData>) | undefined)) => Promise<QueryObserverResult<Address[], unknown>>
}
const AddressCart = ({address, refetch}:Props) => {
    const {setPreferredAddress, isSuccess:isSePreferredSuccess} = useSetPreferredUserAddresses()
    const {deleteAddress, isSuccess:isDeleteSuccess} = useDeleteUserAddresses()



    useEffect(() => {
        refetch()
    }, [isSePreferredSuccess, isDeleteSuccess]);

    return (
        <Card className={'border-gray-400 border rounded'}>
                {address?.preferred &&
                    (<>
                        <CardHeader className={'w-fit pb-4'}>
                            <div className={'text-sm bg-gray-200 block rounded px-3'}>
                                Preferred shipping address
                            </div>
                        </CardHeader>
                        <Separator className={'w-[90%] bg-gray-400 mx-auto h-[1px] '}/>
                    </>
                    )}
            <CardContent className={'text-sm text-gray-700 space-y-2 mt-5'}>
                <section>
                    {`${address?.firstName} ${address?.lastName}`}
                </section>

                <section>
                    {`${address?.addressLine1},  ${address?.addressLine2}, ${address?.city}, ${address?.state}, ${address?.zipCode}`}
                </section>

                <section>
                    {`+996 ${address?.phoneNumber}`}
                </section>

            </CardContent>
            <CardFooter>
                <section className={'flex flex-row space-x-1 text-sm'}>
                    {!address?.preferred && (
                        <button
                            onClick={()=>setPreferredAddress(address?._id || "unkown_id")}
                            className={'px-3 py-1  border rounded border-gray-400'}>Set as preferred</button>
                    )}
                    <EditAddressDialogs address={address} refetch={refetch}/>

                    <button className={'flex items-center py-1 px-2  border rounded border-gray-400 '}>
                        <GoTrash onClick={()=>deleteAddress(address?._id || "unkown_id")}/>
                    </button>


                </section>
            </CardFooter>
        </Card>
    );
};

export default AddressCart;