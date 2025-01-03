import ProductViewCart from "../pages/Product/component/ProductViewCart.tsx";
import { getRandomProductsRequest } from "../../api/ProductAPI.tsx";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel.tsx";
import { useEffect, useState } from "react";
import { GetProductUser } from "../../types/product.type.ts";  // Импортируйте тип

type Props = {
    gender?: string;
    category?: string;
};

const RecommendedProductList = ({ gender, category }: Props) => {
    const [products, setProducts] = useState<GetProductUser[]>([]); // Стейт с типом GetProductUser[]

    useEffect(() => {
        // Создаем асинхронную функцию внутри useEffect
        const fetchProducts = async () => {
            try {
                // getRandomProductsRequest — это асинхронная функция, которая возвращает Promise<GetProductUser[]>
                const result = await getRandomProductsRequest({ gender: gender || "", category: category || "" });
                setProducts(await result());  // Устанавливаем полученные данные в стейт
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchProducts();  // Вызываем асинхронную функцию для загрузки данных
    }, [gender, category]);  // Добавляем зависимость от gender и category

    return (
        <div>
            <section className="flex justify-center items-center mb-5 text-3xl font-medium">
                Recommended for you
            </section>

            <section>
                <Carousel opts={{ align: "start" }} className="w-full max-w-sm flex flex-1 box-carousel_box">
                    <div className="Button-box Button-box-left mr-1.5 HomeProductList">
                        <CarouselPrevious />
                    </div>

                    <CarouselContent className="ml-0 w-full flex-1 box-content_product gap-5">
                        {products && products.length > 0 ? (
                            products.map((product) => (
                                <CarouselItem className="max-w-[400px]" key={product._id}> {/* Используем уникальный _id для ключа */}
                                    <ProductViewCart product={product} />
                                </CarouselItem>
                            ))
                        ) : (
                            <div>Loading products...</div> // Можете добавить индикатор загрузки
                        )}
                    </CarouselContent>

                    <div className="Button-box Button-box-right ml-1.5 HomeProductList">
                        <CarouselNext />
                    </div>
                </Carousel>
            </section>
        </div>
    );
};

export default RecommendedProductList;
