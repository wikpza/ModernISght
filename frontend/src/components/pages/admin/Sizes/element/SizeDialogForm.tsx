
import React from "react";
import {DialogClose, DialogHeader, DialogTitle} from "../../../../ui/dialog.tsx";
import {AiOutlineClose} from "react-icons/ai";
import {Separator} from "../../../../ui/separator.tsx";
import * as Dialog from '@radix-ui/react-dialog';
import SizeValueForm from "../../../../forms/SizeValueForm.tsx";



type Props= {
    sizeValue?:string,
    sizeId:string,
    id?:string
}
export default ({sizeValue, id, sizeId}:Props) => {


    const [open, setOpen] = React.useState(false);
    return (
        <Dialog.Root open={open} onOpenChange={setOpen} >
            <Dialog.Trigger className={''}>
                <div
                    className="p-2 border-gray-300 border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300"
                >
                    {sizeValue}
                </div>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" style={{zIndex: "1000"}}>

                    <Dialog.Content className="DialogContent rounded sm:rounded-t rounded-t-3xl w-full">
                        <DialogHeader>
                        <div className={'flex flex-row justify-between'}>
                                <DialogTitle className={'text-2xl mb-2 '}>Edit Size</DialogTitle>
                                <DialogClose> <AiOutlineClose className={' w-8 h-8 bg-gray-200'} /></DialogClose>
                            </div>
                            <Separator className={'bg-slate-400 w-full h-[1px] '}/>

                            <SizeValueForm sizeValue={sizeValue} id={id} sizeId={sizeId}/>
                        </DialogHeader>
                    </Dialog.Content>
                </Dialog.Overlay>

            </Dialog.Portal>
        </Dialog.Root>
    );
};

