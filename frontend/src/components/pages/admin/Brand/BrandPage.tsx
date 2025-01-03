import AdminLayout from "../component/AdminLayout.tsx";
import {useGetBrands} from "../../../../api/BrandApi.tsx";
import ItemList from "./element/ItemList.tsx";
import CreateBrandDialog from "./element/CreateBrandDialog.tsx";
import ItemCart from "./element/ItemCart.tsx";



const BrandPage = () => {
    const {brands, isLoading, error} = useGetBrands()

    return (
        <AdminLayout className={""}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Brands</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load addresses. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Brands</h3>
                        <div><CreateBrandDialog/></div>
                    </div>


                    <ItemList values={brands} isLoading={isLoading} name={"brand"}>

                        {brands && brands.map((value, index) =>
                            <ItemCart value={value} key = {index}/>)}

                    </ItemList>
                </section>
            }
        </AdminLayout>
    );
};

export default BrandPage;