import AdminLayout from "../component/AdminLayout.tsx";
import {useGetProducts} from "../../../../api/ProductAPI.tsx";

import ProductList from "./elements/ProductList.tsx";
import ProductCart from "./elements/ProductCart.tsx";
import {useGetBrands} from "../../../../api/BrandApi.tsx";
import {useGetCollections} from "../../../../api/CollectionApi.tsx";
import {useGetCategories} from "../../../../api/CategoryApi.tsx";
import {useGetGenders} from "../../../../api/GenderAPI.tsx";
import {useState} from "react";
import {TfiPlus} from "react-icons/tfi";
import {AiOutlineMinus} from "react-icons/ai";
import CreateProductCart from "./elements/CreateProductCart.tsx";




const ProductPage = () => {
    const {products, isLoading:productIsLoading, error} = useGetProducts()
    const [addProduct, setAddProduct] = useState(false)

    const {brands} = useGetBrands()
    const {collections} = useGetCollections()
    const {categories} = useGetCategories()
    const {genders} = useGetGenders()



    return (
        <AdminLayout className={""}>
            {error && !productIsLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Product</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load product. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Products</h3>

                        {addProduct ?
                            <div className={'flex flex-row items-center cursor-pointer'}
                                 onClick={() => setAddProduct(false)}>
                                <AiOutlineMinus/>
                                <span className={'ml-2 flex '}>Close</span>
                            </div>
                            :
                            <div className={'flex flex-row items-center cursor-pointer'}
                                 onClick={() => setAddProduct(true)}>
                                <TfiPlus/>
                                <span className={'ml-3 flex '}>Add new</span>
                            </div>
                        }


                    </div>


                    <ProductList values={products || []} isLoading={productIsLoading} name={"Products"} addProduct={addProduct}>
                        {addProduct && <CreateProductCart/>}
                        {products && brands && genders && categories && collections && products?.length !== 0 && products.map(product => (
                            <ProductCart key={product._id} product={product} brands={brands} genders={genders}
                                         categories={categories} collections={collections}/>
                        ))}

                    </ProductList>


                </section>
            }
        </AdminLayout>
    );
};

export default ProductPage;