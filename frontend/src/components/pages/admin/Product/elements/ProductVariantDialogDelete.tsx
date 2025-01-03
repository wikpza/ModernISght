import {
    Dialog,
    DialogContent,
 DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../../ui/dialog.tsx";


import {Button} from "../../../../ui/button.tsx";
import {Separator} from "../../../../ui/separator.tsx";

type Props = {
    productId:string,
    variantId:string,
}
export function ProductVariantDialogDelete({variantId, productId}:Props) {


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className={'w-full min-h-[60px] mt-4 bg-red-700 hover:bg-red-800 transition-all duration-150 rounded  text-base'}
                >Delete</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete product Variant</DialogTitle>
                <Separator className={'bg-gray-400 h-[2px]'}/>
                </DialogHeader>
                        <div  className="text-wrap">
                            Deletion is possible only if no purchases have been made with this product. If the product has been moved or is still in stock, all related information will be erased upon deletion. Are you sure you want to delete it? You can disable the 'active' status to hide the product from users without deleting it.


                        </div>


                <DialogFooter>
                    <Button className={"bg-red-700 hover:bg-red-800  py-6 w-full text-base"}>Delete</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
