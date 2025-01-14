import AdminLayout from "../component/AdminLayout.tsx";


import {useGetColors} from "../../../../api/ColorApi.tsx";
import CreateColorDialog from "./element/CreateColorDialog.tsx";
import ItemList from "../Brand/element/ItemList.tsx";
import ColorCart from "./element/ColorCart.tsx";



const ColorPage = () => {
    const {colors, isLoading, error} = useGetColors()

    return (
        <AdminLayout className={""}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Color</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load addresses. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Color</h3>

                        <div><CreateColorDialog/></div>

                    </div>

                    <ItemList values={colors} isLoading={isLoading} name = {"Color"}>
                        {colors && colors.map((value, index) =>
                            <ColorCart value={value} key = {index}/>)}
                    </ItemList>

                </section>
            }
        </AdminLayout>
    );
};

export default ColorPage;