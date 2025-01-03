import { useState} from "react";
import { Button } from "../../../ui/button.tsx";
import {DotButton, useDotButton} from "../../../ui/carousel/EmblaCarouselDotButton.tsx";
import useEmblaCarousel from "embla-carousel-react";
import {EmblaOptionsType} from "embla-carousel";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {Product} from "../../../../types/product.type.ts";
import {Color, CreateProductVariant} from "../../../../types.ts";
import ColorComboBox from "../../../elements/ColorComboBox.tsx";
import {Input} from "../../../ui/input.tsx";
import {toast} from "sonner";
import {
    useDeletePictureProductVariant,
    useUpdateProductVariant
} from "../../../../api/Product.variantAPI.tsx";
import {Checkbox} from "../../../ui/checkbox.tsx";
import {ProductVariantDialogDelete} from "../Product/elements/ProductVariantDialogDelete.tsx";
import {Separator} from "../../../ui/separator.tsx";
import ProductInventoryForm from "./ProductInventoryForm.tsx";
import ProductInventoryTable from "./ProductInventoryTable.tsx";
import ProductVariantDicscount from "./ProductVariantDicscount.tsx";


type Props ={
    product:Product,
    colors:Color[] | undefined,
}
const UpdateProductVariantForm = ({product, colors}:Props) => {

    const [loadImagesList, setLoadImagesList] = useState<string[]>(product.productVariant[0].images || []);

    const {deletePicture, isSuccess:isDeletedPictureSuccess} = useDeletePictureProductVariant()

    const [imagesList, setImagesList] = useState<string[]>([]);

    const [error, setError] = useState<string | null>(null);

    const [productVariant, setProductVariant] = useState<CreateProductVariant>({
        color: colors?.find(color=>color._id === product.productVariant[0].colorId) || { name: "", _id: "" } ,
        sku: product.productVariant[0].sku,
        images:  [],
        price: Number(product.productVariant[0].price) || 0,
        available: product.productVariant[0].available || false,
        active: product.productVariant[0].active || false,
    });
    // Функция для обработки файлов
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setError(null); // Сбрасываем ошибку перед новой загрузкой

            // Проверка на количество файлов
            if (files.length + productVariant.images.length > 8) {
                setError("Можно загрузить не более 8 изображений");
                return;
            }

            const newImages: File[] = [];
            const newImageUrls: string[] = []; // Массив для хранения строковых URL изображений

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Проверка типа файла
                if (!file.type.startsWith("image/")) {
                    setError("Загружать можно только изображения.");
                    return;
                }

                // Генерация URL для предварительного просмотра изображения
                const imageUrl = URL.createObjectURL(file);
                newImageUrls.push(imageUrl);

                newImages.push(file);

                // Когда все файлы обработаны, обновляем состояние
                if (newImages.length === files.length) {
                    // Обновление массива изображений в productVariant
                    setProductVariant((prev) => ({
                        ...prev,
                        images: [...prev.images, ...newImages],
                    }));

                    // Добавление строковых URL в imagesList для отображения
                    setImagesList((prevList) => [...prevList, ...newImageUrls]);
                }
            }
        }
    };
    const handleDeleteImage = (index: number) => {
        setImagesList((prevList) => prevList.filter((_, i) => i !== index));
    };
    const emblaOptions: EmblaOptionsType = {
        loop: true, // Включаем цикличность слайдов
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const onPrevButtonClick = () => emblaApi.scrollPrev();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const onNextButtonClick = () => emblaApi.scrollNext();
    const validateUpdateProduct=()=>{
        if(productVariant.color._id === ""){
            toast.error("color can't be empty")
            return false
        }

        if(productVariant.price === 0){
            toast.error("price can not be 0")
            return false
        }



        if(productVariant.images.length + loadImagesList.length > 8){
            toast.error("number of the pictures can not be more than 8")
            return false
        }



        return true

    }
    const {updateProduct, isSuccess:isUpdateProductVariant} = useUpdateProductVariant()
    const handleSubmit = ()=>{
        if(validateUpdateProduct()){
            updateProduct({ variant:productVariant, productId:product._id || "", variantId:product.productVariant[0]._id || ""})
        }
    }
    const handleDeletePicture = (indexDeleted:number)=>{
        const newArray = loadImagesList.filter((_, index) => index !== indexDeleted);
        setLoadImagesList(newArray)
        deletePicture({productId:product._id, variantId:product.productVariant[0]._id, images:newArray})
    }
    const handleSetFirstPicture = (indexOrdered:number)=>{
        if(indexOrdered === 0) {
            toast.error('picture is the first')
            return
        }
        const element = loadImagesList[indexOrdered]
        const newArray = [element].concat(loadImagesList.filter((_, index) => index !== indexOrdered))
        setLoadImagesList([...newArray])
        deletePicture({productId:product._id, variantId:product.productVariant[0]._id, images:newArray})
    }

    if(isDeletedPictureSuccess || isUpdateProductVariant) window.location.reload()
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 font-sans">

                <div className={'relative'}>
                    <section className="p-4 lg:grid hidden lg:grid-cols-[1fr_1fr] gap-1 sticky top-20 ">

                        {loadImagesList.length !== 0 && loadImagesList.map((image, index) => (
                            <div key={index} className="relative">
                                {/* Изображение */}
                                <img src={`http://localhost:9003/picture/${image}`} alt={`Uploaded image ${index + 1}`}
                                     className="max-w-full h-auto"/>

                                {/* Кнопка "Удалить" слева */}
                                <Button
                                    onClick={() => handleDeletePicture(index)}
                                    className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </Button>

                                <Button
                                    onClick={() => handleSetFirstPicture(index)}
                                    className="absolute top-2 left-20 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                                >
                                    Set First
                                </Button>
                            </div>
                        ))}

                        {imagesList.length !== 0 && imagesList.map((image, index) => (
                            <div key={index} className="relative">
                                {/* Изображение */}
                                <img src={image} alt={`Uploaded image ${index + 1}`} className="max-w-full h-auto"/>

                                {/* Кнопка "Удалить" слева */}
                                <Button
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex">
                            <label
                                htmlFor="file-input"
                                className="bg-gray-300 text-center text-black cursor-pointer w-full  aspect-h-1 aspect-w-1 min-h-[60px] flex items-center justify-center rounded-lg hover:bg-gray-500 border-black border ">
                                Добавить фото
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                onChange={handleFileChange}
                                multiple
                                accept="image/webp"
                                className="hidden"
                            />
                        </div>

                    </section>

                    <section className={"lg:hidden block "}>
                        <section className="embla">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">

                                    {loadImagesList.length > 0 &&
                                        loadImagesList.map((image, index) => (
                                            <div key={index} className="relative embla__slide">
                                                {/* Изображение */}
                                                <img src={`http://localhost:9003/picture/${image}`}
                                                     alt={`Uploaded image ${index + 1} `}
                                                     className="max-w-full h-auto embla__slide__image"/>

                                                {/* Кнопка "Удалить" слева */}
                                                <Button
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="absolute top-2 left-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    onClick={() => handleSetFirstPicture(index)}
                                                    className="absolute top-2 left-20 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
                                                >
                                                    Set First
                                                </Button>
                                            </div>


                                        ))}
                                    {imagesList.length > 0 &&
                                        imagesList.map((image, index) => (
                                            <div key={index} className="relative embla__slide">
                                                {/* Изображение */}
                                                <img src={image} alt={`Uploaded image ${index + 1} `}
                                                     className="max-w-full h-auto embla__slide__image"/>

                                                {/* Кнопка "Удалить" слева */}
                                                <Button
                                                    onClick={() => handleDeleteImage(index)}
                                                    className="absolute top-2 left-4 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                                                >
                                                    Delete
                                                </Button>
                                            </div>


                                        ))}
                                </div>
                            </div>

                            {
                                (imagesList.length !== 0 || loadImagesList.length !== 0) &&
                                <div className="embla__controls w-full flex justify-between px-4">

                                    <div className="embla__buttons py-2">

                                        <IoIosArrowBack onClick={onPrevButtonClick}
                                                        className={`text-5xl bg-gray-300 rounded-2xl `}/>

                                        <IoIosArrowForward onClick={onNextButtonClick}
                                                           className={"text-5xl bg-gray-300 rounded-2xl ml-1"}/>
                                    </div>

                                    <div className="embla__dots">
                                        {scrollSnaps.map((_, index) => (
                                            <DotButton
                                                key={index}
                                                onClick={() => onDotButtonClick(index)}
                                                className={
                                                    'embla__dot' +
                                                    (index === selectedIndex ? ' embla__dot--selected' : '')
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            }

                        </section>

                        <div className="flex">
                            <label
                                htmlFor="file-input"
                                className="bg-gray-300 text-center text-black cursor-pointer w-full  aspect-h-1 aspect-w-1 min-h-[60px] min-w-[60px] flex items-center justify-center rounded-lg hover:bg-gray-500 border-black border ">
                                Добавить фото
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                onChange={handleFileChange}
                                multiple
                                accept="image/webp"
                                className="hidden"
                            />
                        </div>
                    </section>
                </div>

                <div className="p-4 pb-4 space-y-3">
                    <section className={'space-y-4'}>
                        <div>{product.genderId.name}</div>
                        <div className={'text-4xl font-medium'}>{product.name}</div>
                    </section>
                    <Separator className={'bg-gray-400 h-[1px]'}/>
                    <div className={'flex'}>
                        <Input
                            placeholder={"Input the price of product"}
                            className={'border border-gray-500 mr-3'}
                            value={productVariant.price}
                            type="number"  // Указываем тип number
                            step="any"  // Разрешаем дробные числа
                            onChange={(e) => {
                                const value = e.target.value;
                                const parsedValue = parseFloat(value);

                                // Проверка на валидное число и что оно положительное
                                if (!isNaN(parsedValue) && parsedValue > 0) {
                                    setProductVariant({...productVariant, price: parsedValue});
                                    setError(null);  // Если значение правильное, сбрасываем ошибку
                                } else {
                                    setError("Price must be a positive number");
                                }
                            }}
                        />

                        {colors &&
                            <div className={'border border-gray-500 rounded-sm'}>

                                <ColorComboBox
                                    listOfValue={colors} selectedName={productVariant.color}
                                    setName={(value: {
                                        _id: string,
                                        name: string
                                    }) => setProductVariant({...productVariant, color: value})}
                                    optionName={"Color"}/>
                            </div>
                        }
                    </div>
                    <Separator className={'bg-gray-400 h-[1px]'}/>
                    <section className={'flex items-center'}>
                        <Checkbox
                            onCheckedChange={() => setProductVariant({
                                ...productVariant,
                                active: !productVariant.active
                            })}
                            checked={productVariant.active} className={'mr-3'}></Checkbox>
                        <div> is active</div>
                    </section>

                    <section className={'flex items-center'}>
                        <Checkbox
                            onCheckedChange={() => setProductVariant({
                                ...productVariant,
                                available: !productVariant.available
                            })}
                            checked={productVariant.available} className={'mr-3'}></Checkbox>
                        <div> is available</div>
                    </section>

                    <ProductVariantDicscount productId={product.productVariant[0]._id} discount={product.productVariant[0].discountInfo}/>



                    <div className={"flex space-x-2 text-lg"}>

                        <Button
                            className={'w-full min-h-[60px] mt-4 bg-blue-700 hover:bg-blue-900 transition-all duration-150 rounded text-base'}
                            onClick={handleSubmit}
                        >Update
                        </Button>

                        <ProductVariantDialogDelete productId={product._id} variantId={product.productVariant[0]._id}/>

                    </div>
                    <div className={'pt-14'}>
                        <Separator className={'bg-gray-400 h-[1px]'}/>
                        <div className={"my-5 text-center text-2xl font-bold"}>Inventory of product</div>
                        <ProductInventoryForm product={product}/>
                    </div>

                </div>

            </div>


            <Separator className={'bg-gray-400 h-[1px] my-14'}/>

            <div>
                <div className={"my-5 text-center text-2xl font-bold"}>Inventory session of product</div>
                <ProductInventoryTable productId={product.productVariant[0]._id}/>
            </div>
        </div>
    );
};

export default UpdateProductVariantForm;
