import {useLoading} from "../../../../elements/header/LoadingOverlay.tsx";
import { Collection} from "../../../../../types.ts";
import React from "react";
import {DialogClose, DialogHeader, DialogTitle} from "../../../../ui/dialog.tsx";
import {AiOutlineClose} from "react-icons/ai";
import {Separator} from "../../../../ui/separator.tsx";
import * as Dialog from '@radix-ui/react-dialog';

import {useUpdateGender} from "../../../../../api/GenderAPI.tsx";
import GenderForm from "../../../../forms/GenderForm.tsx";

type Props= {
    collection?:Collection
}
export default ({collection}:Props) => {

    const {isLoading, updateGender, isSuccess} = useUpdateGender()
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
                                <DialogTitle className={'text-2xl mb-2 '}>Edit Category</DialogTitle>
                                <DialogClose> <AiOutlineClose className={' w-8 h-8 bg-gray-200'} /></DialogClose>
                            </div>
                            <Separator className={'bg-slate-400 w-full h-[1px] '}/>

                            <GenderForm  setOpen={setOpen} gender={collection} onSave={updateGender} type={"PATCH"} />

                        </DialogHeader>
                    </Dialog.Content>
                </Dialog.Overlay>

            </Dialog.Portal>
        </Dialog.Root>
    );
};

