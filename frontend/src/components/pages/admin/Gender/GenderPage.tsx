import AdminLayout from "../component/AdminLayout.tsx";
import ItemList from "../Brand/element/ItemList.tsx";
import {useGetGenders} from "../../../../api/GenderAPI.tsx";
import CreateGenderDialog from "./element/CreateGenderDialog.tsx";
import GenderCart from "./element/GenderCart.tsx";




const CategoryPage = () => {
    const {genders, isLoading, error} = useGetGenders()

    return (
        <AdminLayout className={""}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Gender</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load addresses. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Gender</h3>

                        <div><CreateGenderDialog/></div>

                    </div>


                    <ItemList values={genders} isLoading={isLoading} name={"Gender"}>

                        {genders && genders.map((value, index) =>

                            <GenderCart value={value} key = {index}/>)}

                    </ItemList>


                </section>
            }
        </AdminLayout>
    );
};

export default CategoryPage;