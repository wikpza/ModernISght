
import {Card, CardContent} from "../../../../ui/card.tsx";
import {GoTrash} from "react-icons/go";
import {useDeleteColor} from "../../../../../api/ColorApi.tsx";
import {Color} from "../../../../../types.ts";
import EditColorDialog from "./EditColorDialog.tsx";


type Props = {
    value?: Color,
}
const ColorCart = ({value}:Props) => {

    const {deleteColor, isSuccess:isDeleteSuccess} = useDeleteColor()

    if(isDeleteSuccess)  location.reload();


    return (
        <Card className={'border-gray-400 border rounded max-w-[400px] min-w-[180px] flex-row m-2 addShadow'}>

            <CardContent className={'text-base text-black space-x-4 mt-5 flex flex-row justify-between'}>

                <div className={'flex flex-wrap space-x-2'}>
                    <section className={'flex items-center'}>
                        {`${value?.name}`}
                    </section>

                    <section className={'flex items-center text-sm '}>
                        {`${value?.hexCode}`}
                    </section>

                    <section className={'flex items-center border-2 border-black'}
                             style={{width: "25px", height: "25px", backgroundColor: value?.hexCode}}>
                    </section>
                </div>


                <section className={'flex flex-row space-x-1 text-sm'}>


                    <EditColorDialog color={value}/>

                    <button className={'flex items-center py-1 px-2  border rounded border-gray-400 '}>
                        <GoTrash onClick={() => deleteColor(value?._id || "unkown_id")}/>
                    </button>

                </section>
            </CardContent>
        </Card>
    );
};

export default ColorCart;