
import {Card, CardContent} from "../../../../ui/card.tsx";
import {GoTrash} from "react-icons/go";
import {Collection} from "../../../../../types.ts";
import EditCategoryDialog from "./EditCategoryDialog.tsx";
import {useDeleteCategory} from "../../../../../api/CategoryApi.tsx";


type Props = {
    value?: Collection,
}
const CategoryCart = ({value}:Props) => {

    const {deleteCategory, isSuccess:isDeleteSuccess} = useDeleteCategory()

    if(isDeleteSuccess)  location.reload();


    return (
        <Card className={'border-gray-400 border rounded max-w-[400px] min-w-[180px] flex-row m-2 addShadow'}>

            <CardContent className={'text-base text-black space-x-4 mt-5 flex flex-row justify-between'}>
                <section className={'flex items-center'}>
                    {`${value?.name}`}
                </section>

                <section className={'flex flex-row space-x-1 text-sm'}>

                    <EditCategoryDialog category={value}/>

                    <button className={'flex items-center py-1 px-2  border rounded border-gray-400 '}>
                        <GoTrash onClick={()=>deleteCategory(value?._id || "unkown_id")}/>
                    </button>

                </section>
            </CardContent>
        </Card>
    );
};

export default CategoryCart;