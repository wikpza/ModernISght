import {Item} from "./ItemList.tsx";
import {Card, CardContent} from "../../../../ui/card.tsx";
import {useDeleteBrand} from "../../../../../api/BrandApi.tsx";
import {GoTrash} from "react-icons/go";
import EditBrandDialog from "./EditBrandDialog.tsx";


type Props = {
    value?: Item,
}
const ItemCart = ({value}:Props) => {

    const {deleteBrand, isSuccess:isDeleteSuccess} = useDeleteBrand()

    if(isDeleteSuccess)  location.reload();


    return (
        <Card className={'border-gray-400 border rounded max-w-[400px] min-w-[180px] flex-row m-2 addShadow'}>

            <CardContent className={'text-base text-black space-x-4 mt-5 flex flex-row justify-between'}>
                <section className={'flex items-center'}>
                    {`${value?.name}`}
                </section>

                <section className={'flex flex-row space-x-1 text-sm'}>

                    <EditBrandDialog brand={value}/>

                    <button className={'flex items-center py-1 px-2  border rounded border-gray-400 '}>
                        <GoTrash onClick={()=>deleteBrand(value?._id || "unkown_id")}/>
                    </button>

                </section>
            </CardContent>
        </Card>
    );
};

export default ItemCart;