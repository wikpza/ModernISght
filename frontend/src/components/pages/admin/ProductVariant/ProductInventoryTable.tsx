import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../ui/table.tsx";
import "./pagination.css"
import { UseGetProductInventorySession } from "../../../../api/InventorySessionAPI.tsx";
import { Card } from "../../../ui/card.tsx";
import ResponsivePaginationComponent from "react-responsive-pagination";
import { InventorySessionList } from "../../../../types/inventory.type.ts";

type Props = {
    productId: string;
};

const ProductInventoryTable = ({ productId }: Props) => {
    const [page, setPage] = useState(1); // Состояние текущей страницы
    const [totalPages, setTotalPages] = useState(1); // Состояние для общего количества страниц
    const [sessionList, setSessionList] = useState<InventorySessionList[]>([]); // Состояние для списка сессий

    const { productInventory, isLoading, error } = UseGetProductInventorySession(productId, page);

    // Используем useEffect для обновления данных при изменении страницы
    useEffect(() => {
        if (productInventory) {
            setSessionList(productInventory.sessionList || []);
            setTotalPages(productInventory.page || 1); // Если totalPages присутствует в ответе, устанавливаем его
        }
    }, [productInventory]); // Зависимость от productInventory, чтобы обновить данные, когда они изменятся

    // Если данные еще загружаются, можно отобразить индикатор загрузки
    if (isLoading) return <div>Loading...</div>;

    // Если произошла ошибка, показываем сообщение об ошибке
    if (error) return <div>Error: {"Error"}</div>;

    return (
        <div>
            <Card className={"m-5"}>
                <section>
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessionList?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.Date}</TableCell>
                                    <TableCell>{`${item.lastName} ${item.firstName}`}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.role}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
            </Card>

            <section>
                <ResponsivePaginationComponent
                    current={page}
                    total={totalPages}
                    onPageChange={(newPage) => setPage(newPage)} // Обновляем страницу при смене страницы
                />
            </section>
        </div>
    );
};

export default ProductInventoryTable;
