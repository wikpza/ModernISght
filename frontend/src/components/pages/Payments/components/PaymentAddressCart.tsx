
import {Address} from "../../../../types.ts";
import {Card, CardContent, CardFooter, CardHeader} from "../../../ui/card.tsx";
import {Separator} from "../../../ui/separator.tsx";
import {Button} from "../../../ui/button.tsx";


type Props = {
    address?: Address,
    selectedAddress:Address,
    setSelectedAddress:(address:Address)=>void
}
const AddressCart = ({address, setSelectedAddress, selectedAddress}:Props) => {

    if(!address){
        return (<div>

        </div>)
    }
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

                    {selectedAddress._id !== address._id &&
                        <Button  onClick={()=>setSelectedAddress(address)} className={'flex items-center  px-2  border rounded border-gray-400 bg-blue-600 py-5 hover:bg-blue-800 w-[200px]'}>
                            Select
                        </Button>
                    }


                </section>
            </CardFooter>
        </Card>
    );
};

export default AddressCart;