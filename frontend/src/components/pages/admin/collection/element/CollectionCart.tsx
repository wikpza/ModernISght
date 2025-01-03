
import {Card, CardContent} from "../../../../ui/card.tsx";
import {GoTrash} from "react-icons/go";
import {Collection} from "../../../../../types.ts";
import {useDeleteCollection} from "../../../../../api/CollectionApi.tsx";
import EditCollectionDialog from "./EditCollectionDialog.tsx";



type Props = {
    value?: Collection,
}
const CollectionCart = ({value}:Props) => {

    const {deleteCollection, isSuccess:isDeleteSuccess} = useDeleteCollection()

    if(isDeleteSuccess)  location.reload();


    return (
        <Card className={'border-gray-400 border rounded max-w-[400px] min-w-[180px] flex-row m-2 addShadow'}>

            <CardContent className={'text-base text-black space-x-4 mt-5 flex flex-row justify-between'}>
                <section className={'flex items-center'}>
                    {`${value?.name}`}
                </section>

                <section className={'flex flex-row space-x-1 text-sm'}>

                    <EditCollectionDialog collection={value}/>

                    <button className={'flex items-center py-1 px-2  border rounded border-gray-400 '}>
                        <GoTrash onClick={()=>deleteCollection(value?._id || "unkown_id")}/>
                    </button>

                </section>
            </CardContent>
        </Card>
    );
};

export default CollectionCart;