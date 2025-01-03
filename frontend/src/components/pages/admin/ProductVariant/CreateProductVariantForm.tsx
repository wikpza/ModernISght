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
import CustomButton from "../../../ui/CustomButton.tsx";
import {toast} from "sonner";
import {useCreateProductVariant} from "../../../../api/Product.variantAPI.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Checkbox} from "../../../ui/checkbox.tsx";


type Props ={
    product:Product,
    colors:Color[] | undefined,
}
const CreateProductVariantForm = ({product, colors}:Props) => {
    const { id } = useParams<{ id: string }>();
    const [imagesList, setImagesList] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [productVariant, setProductVariant] = useState<CreateProductVariant>({
        color: { name: "", _id: "" },
        sku: "",
        images: [],
        price: 0,
        available: false,
        active: true,
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

        if(productVariant.images.length === 0){
            toast.error("add picture")
            return false
        }

        if(productVariant.images.length > 8){
            toast.error("number of the pictures can not be more than 8")
            return false
        }



        return true

    }

    const {addProduct, isSuccess} = useCreateProductVariant()

    const navigate = useNavigate()
    const handleSubmit = ()=>{
        if(validateUpdateProduct()){
            addProduct({ variant:productVariant, id:id || ""})
        }
    }

    if(isSuccess) navigate("/admin/product")

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">

                <div>
                    <section className="p-4 lg:grid hidden lg:grid-cols-[1fr_1fr] gap-1">

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

                    <section className={"lg:hidden block"}>
                        <section className="embla">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
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
                                imagesList.length !== 0 &&
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

                <div className="p-4 pb-4 font-sans ">
                    <section className={'space-y-4'}>
                        <div>{product.genderId.name}</div>
                        <div className={'text-4xl font-medium'}>{product.name}</div>
                    </section>

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

                    <section className={'flex items-center'}>
                        <Checkbox
                            onCheckedChange={() => setProductVariant({...productVariant, active: !productVariant.active})}
                            checked={productVariant.active} className={'mr-3'}></Checkbox>
                        <div> is active</div>
                    </section>

                    <section className={'flex items-center'}>
                        <Checkbox
                            onCheckedChange={() => setProductVariant({...productVariant, available: !productVariant.available})}
                            checked={productVariant.available} className={'mr-3'}></Checkbox>
                        <div> is available</div>
                    </section>



                    <div onClick={handleSubmit}>
                        <CustomButton className={'w-full min-h-[60px] mt-4'}>Add Product Variant</CustomButton>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default CreateProductVariantForm;
