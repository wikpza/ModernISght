import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {TfiPlus} from "react-icons/tfi";
import {DialogClose, DialogHeader, DialogTitle} from "../../../ui/dialog.tsx";
import {AiOutlineClose} from "react-icons/ai";
import {Separator} from "@radix-ui/react-dropdown-menu";
import CreateCardForm from "./CreateCardForm.tsx";

const CreatePaymentsDialog = () => {
    const [open, setOpen] = React.useState(false);



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
                                <DialogTitle className={'text-2xl mb-2 '}>Add new Payments</DialogTitle>
                                <DialogClose> <AiOutlineClose className={' w-8 h-8 bg-gray-200'} /></DialogClose>
                            </div>

                            <Separator className={'bg-slate-400 w-full h-[1px] '}/>

                            <CreateCardForm/>
                        </DialogHeader>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default CreatePaymentsDialog;