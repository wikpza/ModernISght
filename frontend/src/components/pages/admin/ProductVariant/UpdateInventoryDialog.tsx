import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../ui/dialog.tsx";
import {Button} from "../../../ui/button.tsx";
import {Separator} from "../../../ui/separator.tsx";
import {Input} from "../../../ui/input.tsx";
import {useState} from "react";
import {usePatchProductInventory} from "../../../../api/InventoryApi.tsx";
import { toast } from "sonner";


type Props = {
    sizeId:string,
    productId:string,
}
const UpdateInventoryDialog = ({sizeId, productId}:Props) => {


    const [quantity, setQuantity] = useState<string>("0")
    const {patchProductInventory, isSuccess} = usePatchProductInventory()

    if(isSuccess) window.location.reload()
    function isValidNumber(input:string) {
        const number = parseInt(input, 10);  // Преобразуем строку в целое число
        if(number < 0) {
            toast.error("quantity must be positive number")
            return false
        }

        if(number > 100) {
            toast.error("quantity must less than 100")
            return false
        }
        return Number.isInteger(number)
    }
    const handle = (type:string)=>{
        if(isValidNumber(quantity)){
            patchProductInventory(
                {
                    sizeId:sizeId,
                    productId:productId,
                    type:type,
                    quantity:parseInt(quantity, 10)
                }
            )
        }
    }
        return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button className={"bg-blue-700"}>Upate</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className={'text-center text-2xl font-medium pb-5'}>Inventory Panel</DialogTitle>
                        <Separator className={'bg-gray-400 h-[1px]'}/>
                        <DialogDescription className={'pt-5'}>
                            This is the inventory management panel. Please select an action and enter the desired
                            quantity to proceed.
                            <br/><br/>
                            <strong>Adding:</strong> Use this button to add new items to the inventory. You will need to
                            specify the quantity of the item being added.
                            <br/>
                            <br/>
                            <strong>Buying:</strong> Use this button to mark an item as purchased. Specify how many
                            items have been bought.
                            <br/>
                            <br/>
                            <strong>Returning:</strong> Use this button to return items to the inventory. Enter the
                            quantity of items being returned.
                            <br/>
                            <br/>
                            <strong>Write-off:</strong> Use this button to write off items from the inventory. This is
                            typically used for damaged, expired, or unsellable items.
                        </DialogDescription>
                        <div className={'py-5'}>
                            <div>Input the quantity you will add /buy /write-off /returning</div>
                            <Input
                                type={"number"}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <div className={'flex gap-2'}>
                            <Button onClick={()=>handle("write-off")} className={' w-full bg-yellow-700 hover:bg-yellow-800 py-2 rounded h-[45px]'}>Write off</Button>
                        </div>

                        <div className={'flex gap-2 '}>
                            <Button onClick={()=>handle("adding")} className={'w-full bg-blue-700 hover:bg-blue-800 py-2 rounded h-[45px]'}>Adding</Button>
                            <Button onClick={()=>handle("buying")} className={'w-full bg-green-700 hover:bg-green-800 py-2 rounded h-[45px]' }>Buying</Button>
                        </div>

                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default UpdateInventoryDialog;