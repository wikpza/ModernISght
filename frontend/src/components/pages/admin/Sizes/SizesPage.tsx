import {useGetSizes} from "../../../../api/SizesApi.tsx";
import AdminLayout from "../component/AdminLayout.tsx";
import SizeList from "./element/SizeList.tsx";
import SizeCart from "./element/SizeCart.tsx";
import {useState} from "react";
import CreateSizesCart from "./element/CreateSizesCart.tsx";
import {TfiPlus} from "react-icons/tfi";
import {Separator} from "../../../ui/separator.tsx";
import {AiOutlineMinus} from "react-icons/ai";



const SizesPage = () => {
    const {sizes, isLoading, error} = useGetSizes()
    const [addSizes, setAddSizes] = useState(false)


    return (
        <AdminLayout className={""}>
            {error && !isLoading ?
                <section className={'flex-1 w-full'}>
                    <div className={'flex mb-2'}>
                        <h3 className={'text-2xl'}>Sizes</h3>
                    </div>
                    <div className={' flex  border rounded border-gray-400 p-4 text-sm font-light'}> Unable to
                        load Sizes. Try to
                        reload page.
                    </div>
                </section>

                :
                <section className={'flex-1 w-full'}>
                    <div className={'flex flex-row justify-between mb-2'}>
                        <h3 className={'text-2xl'}>Sizes</h3>

                        {addSizes ?
                            <div className={'flex flex-row items-center cursor-pointer'}
                                 onClick={() => setAddSizes(false)}>
                                <AiOutlineMinus />
                                <span className={'ml-2 flex '}>Close</span>
                            </div>
                            :
                            <div className={'flex flex-row items-center cursor-pointer'}
                                 onClick={() => setAddSizes(true)}>
                                <TfiPlus/>
                                <span className={'ml-3 flex '}>Add new</span>
                            </div>
                        }


                    </div>


                    <Separator className={"bg-gray-400 my-3"}/>

                    <SizeList values={sizes} isLoading={isLoading} addSize={addSizes}>
                        <div className="size-container flex-col w-full">
                            {addSizes && <CreateSizesCart />}
                            {sizes && sizes.map((value, index) => (
                                <SizeCart value={value} key={index} id ={value._id}/>
                            ))}

                        </div>
                    </SizeList>



                </section>
            }
        </AdminLayout>
    );
};

export default SizesPage;