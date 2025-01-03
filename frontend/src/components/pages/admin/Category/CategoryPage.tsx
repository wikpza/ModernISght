import AdminLayout from "../component/AdminLayout.tsx";

import {useGetCategories} from "../../../../api/CategoryApi.tsx";
import CreateCategoryDialog from "./element/CreateCategoryDialog.tsx";
import ItemList from "../Brand/element/ItemList.tsx";
import CategoryCart from "./element/CategoryCart.tsx";




const CategoryPage = () => {
    const {categories, isLoading, error} = useGetCategories()

    return (
        <AdminLayout className={""}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Category</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load addresses. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Category</h3>

                        <div><CreateCategoryDialog/></div>

                    </div>


                    <ItemList values={categories} isLoading={isLoading}>

                        {categories && categories.map((value, index) =>

                            <CategoryCart value={value} key = {index}/>)}

                    </ItemList>


                </section>
            }
        </AdminLayout>
    );
};

export default CategoryPage;