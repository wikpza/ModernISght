import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../../ui/dialog.tsx";
import {Button} from "../../../ui/button.tsx";
import {LuSettings2} from "react-icons/lu";
import {ParamsSearch} from "./ProductView.tsx";
import ProductViewParams from "./ProductViewParams.tsx";

type Props = {
    params:ParamsSearch,
    setParams:(value:ParamsSearch)=>void,
    className:string
}

const SortParamsProductDialog = ({params, setParams, className}:Props) => {
    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button className={'bg-white hover:bg-white border border-gray-400 text-black font-bold p-5'}
                    >
                        <LuSettings2 className={'text-gray-500 text-lg'}/>
                        {"Set Filter"}
                    </Button>
                </DialogTrigger>

                <DialogContent className={'w-full'}>
                    <DialogHeader>
                        <DialogTitle>Filters</DialogTitle>
                        <DialogDescription>
                            <ProductViewParams params={params} setParams={setParams} className={` mt-10   mr-5 w-full text-black ${className}` }  />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>

            </Dialog>
        </div>
    );
};

export default SortParamsProductDialog;