import React from 'react';

import * as Dialog from "@radix-ui/react-dialog";
import { DialogClose, DialogHeader, DialogTitle } from "../ui/dialog.tsx";
import { AiOutlineClose } from "react-icons/ai";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useGetUserInfo, useUpdateMyUser } from "../../api/MyUserApi.tsx";
import PersonalDetailForm from "../forms/PersonalDetailForm.tsx";
import { observer } from "mobx-react-lite";
import { Context } from "../../main.tsx";
import {useContext, useEffect} from "react";

const ChangePersonalDetails = observer(() => {
    const [open, setOpen] = React.useState(false);
    const { user } = useContext(Context);
    const { updateUser, isLoading, isSuccess, userData } = useUpdateMyUser();
    const { userInfo, refetch } = useGetUserInfo();

    useEffect(() => {
        if (isSuccess && userData) {
            user.setUser({
                ...user.user,
                firstName: userData.firstName,
                lastName: userData.lastName,
            });
            refetch()
        }
    }, [isSuccess, userData]);


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
                                <DialogTitle className={'text-2xl mb-2'}>Edit details</DialogTitle>
                                <DialogClose>
                                    <AiOutlineClose className={'w-8 h-8 bg-gray-200'} />
                                </DialogClose>
                            </div>

                            <Separator className={'bg-slate-400 w-full h-[1px] '} />
                            <PersonalDetailForm userInfo={userInfo} onSave={updateUser} isLoading={isLoading} setOpen={setOpen} />
                        </DialogHeader>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
});

export default ChangePersonalDetails;
