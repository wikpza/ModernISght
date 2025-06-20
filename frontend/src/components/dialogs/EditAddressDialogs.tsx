import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "../ui/dialog.tsx";
import * as Dialog from '@radix-ui/react-dialog';
import {Separator} from "@radix-ui/react-dropdown-menu";
import AddressForm from "../forms/AddressForm.tsx";
import { AiOutlineClose } from "react-icons/ai";
import React from "react";
import {Address} from "../../types.ts";
import {useLoading} from "../elements/header/LoadingOverlay.tsx";
import {useUpdateUserAddress} from "../../api/UserAddressesApi.tsx";


type Props= {
    address?:Address
}
export default ({address}:Props) => {
    const {isLoading, updateUserAddress, isSuccess} = useUpdateUserAddress()
    if(isSuccess)  window.location.reload()
    const {  startLoading, stopLoading } = useLoading();
    if(isLoading){
        startLoading()
    }else{
        stopLoading()
    }
    const [open, setOpen] = React.useState(false);
     return (
        <Dialog.Root open={open} onOpenChange={setOpen} >
            <Dialog.Trigger className={''}>
                <div className={'text-center py-1 px-4  border rounded border-gray-400'}>
                    Edit
                </div>
            </Dialog.Trigger>
            <Dialog.Portal >
                <Dialog.Overlay className="DialogOverlay" style={{zIndex:"1000"}} >

                    <Dialog.Content className="DialogContent rounded sm:rounded-t rounded-t-3xl w-full">
                        <DialogHeader>
                            <div className={'flex flex-row justify-between'}>
                                <DialogTitle className={'text-2xl mb-2 '}>Add new address</DialogTitle>
                                <DialogClose> <AiOutlineClose className={' w-8 h-8 bg-gray-200'} /></DialogClose>
                            </div>
                            <Separator className={'bg-slate-400 w-full h-[1px] '}/>
                            <DialogDescription className={'mt-5'}>
                                This site delivers to the following country: United States of America
                            </DialogDescription>
                            <AddressForm  setOpen={setOpen} address={address} onSave={updateUserAddress} type={"PATCH"} />
                        </DialogHeader>
                    </Dialog.Content>
                </Dialog.Overlay>

            </Dialog.Portal>
        </Dialog.Root>
    );
};

// export default AddressDialogs;