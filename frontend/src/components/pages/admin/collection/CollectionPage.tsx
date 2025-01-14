import AdminLayout from "../component/AdminLayout.tsx";

import ItemList from "../Brand/element/ItemList.tsx";
import {useGetCollections} from "../../../../api/CollectionApi.tsx";
import CollectionCart from "./element/CollectionCart.tsx";
import CreateCollectionDialog from "./element/CreateCollectionDialog.tsx";


const CollectionPage = () => {
    const {collections, isLoading, error} = useGetCollections()

    return (
        <AdminLayout className={""}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Collections</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load addresses. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Collections</h3>

                        <div><CreateCollectionDialog/></div>

                    </div>

                    <ItemList values={collections} isLoading={isLoading} name={"Collection"}>
                        {collections && collections.map((value, index) =>
                            <CollectionCart value={value} key = {index}/>)}
                    </ItemList>
                </section>
            }
        </AdminLayout>
    );
};

export default CollectionPage;