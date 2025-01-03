import React from "react";
import * as Dialog from '@radix-ui/react-dialog';
import {TfiPlus} from "react-icons/tfi";
import {Separator} from "@radix-ui/react-dropdown-menu";
import {AiOutlineClose} from "react-icons/ai";
import {DialogClose, DialogHeader, DialogTitle} from "../../../../ui/dialog.tsx";
import {useCreateColor} from "../../../../../api/ColorApi.tsx";
import ColorForm from "../../../../forms/ColorForm.tsx";



export default () => {
    const [open, setOpen] = React.useState(false);

    const {createColor, isLoading, isSuccess} = useCreateColor()

    if(isSuccess)  window.location.reload()

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger  className={'flex flex-row items-center'}>
                <TfiPlus/><span className={'ml-3 flex '}>Add new</span>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay">
                    <Dialog.Content className="DialogContent rounded sm:rounded-t rounded-t-3xl w-full ">
                        <DialogHeader>
                            <div className={'flex flex-row justify-between'}>
                                <DialogTitle className={'text-2xl mb-2 '}>Add new color</DialogTitle>
                                <DialogClose> <AiOutlineClose className={' w-8 h-8 bg-gray-200'} /></DialogClose>
                            </div>

                            <Separator className={'bg-slate-400 w-full h-[1px] '}/>

                            <ColorForm onSave={createColor} isLoading={isLoading} setOpen={setOpen}/>

                        </DialogHeader>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

