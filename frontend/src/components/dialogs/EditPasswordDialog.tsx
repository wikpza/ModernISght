import * as Dialog from "@radix-ui/react-dialog";
import {DialogClose, DialogHeader, DialogTitle} from "../ui/dialog.tsx";
import {AiOutlineClose} from "react-icons/ai";
import {Separator} from "@radix-ui/react-dropdown-menu";
import React, {useContext} from "react";
import {BiMessageError} from "react-icons/bi";
import {Button} from "../ui/button.tsx";
import VerifyEmailPassword from "../pages/User/VerifyEmailPassword.tsx";
import {Context} from "../../main.tsx";

const EditPasswordDialog = () => {
    const [open, setOpen] = React.useState(false);
    const {user} = useContext(Context)

    const goToPageVerifyPassword = ()=>{
        return (
            <VerifyEmailPassword email={user.user.email}/>
        )
    }
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className={'flex flex-row items-center'}>
                <div className={'text-center py-1 px-4 border rounded border-gray-400 block'}>
                    Edit
                </div>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay">
                    <Dialog.Content className="DialogContent rounded sm:rounded-t rounded-t-3xl w-full">
                        <DialogHeader>

                            <div className={'flex flex-row justify-between'}>
                                <DialogTitle className={'text-2xl mb-2'}>Change password</DialogTitle>
                                <DialogClose>
                                    <AiOutlineClose className={'w-8 h-8 bg-gray-200'} />
                                </DialogClose>
                            </div>
                            <section className={'space-y-5'}>
                                <BiMessageError  style={{color:"blue", fontSize:"150px"}} className={'mx-auto'}/>
                                <Separator className={'bg-slate-400 w-full h-[1px] '} />
                                <div className={'space-y-3'}>
                                    <p className={'text-center '}>Are you sure you want to change the password for your
                                        account? </p>
                                    <p className={'text-center'}>Here’s how it will work: You will receive a link that
                                        will
                                        take you to a page where you can enter your new password, and it will be
                                        saved.</p>
                                </div>

                                <Separator className={'bg-slate-400 w-full h-[1px] '}/>
                                <div className={'flex justify-center'}>
                                    <Button  className={'w-full max-w-[300px] h-full rounded p-5 text-xl bg-blue-800'} onClick={()=>goToPageVerifyPassword()}>Reset Password</Button>
                                </div>
                            </section>
                        </DialogHeader>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EditPasswordDialog;