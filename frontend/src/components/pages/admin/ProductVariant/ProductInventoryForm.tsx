import {Product} from "../../../../types/product.type.ts";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../../../ui/table.tsx";
import {useGetProductInventory} from "../../../../api/InventoryApi.tsx";
import {Card} from "../../../ui/card.tsx";
import UpdateInventoryDialog from "./UpdateInventoryDialog.tsx";
import {getInventory} from "../../../../types/inventory.type.ts";

type Props ={
    product:Product
}
const ProductInventoryForm = ({product}:Props) => {
    const { productInventory } = useGetProductInventory(product.productVariant[0]._id);

    // Функция для разделения данных на два массива
    const splitDataInTwoColumns = (data: getInventory[]) => {
        const midIndex = Math.ceil(data.length / 2);
        return [data.slice(0, midIndex), data.slice(midIndex)];
    };

    // Разделение данных на два массива
    const [leftColumnData, rightColumnData] = splitDataInTwoColumns(productInventory || []);

    return (
        <div>
            <Card className={'m-5 min-w-[200px] p-2 hidden lg:block'}>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead >Size</TableHead>
                            <TableHead className="font-medium" >quantity</TableHead>
                            <TableHead>Update</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            productInventory &&
                            productInventory.map((inventorySize)=>(
                                <TableRow className={'font-sans'}>
                                    <TableCell >{inventorySize.size}</TableCell>
                                    <TableCell className="font-medium" >{inventorySize.quantity}</TableCell>
                                    <TableCell><UpdateInventoryDialog sizeId={inventorySize.sizeId} productId={product.productVariant[0]._id}/></TableCell>
                                </TableRow>

                            ))
                        }
                    </TableBody>
                </Table>
            </Card>

            <div className={'m-5 min-w-[200px] p-2  lg:hidden flex gap-5'}>
                <Card className={"w-full"}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Size</TableHead>
                                <TableHead className="font-medium">Quantity</TableHead>
                                <TableHead>Update</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leftColumnData.map((inventorySize) => (
                                <TableRow key={inventorySize.sizeId} className={'font-sans'}>
                                    <TableCell>{inventorySize.size}</TableCell>
                                    <TableCell className="font-medium">{inventorySize.quantity}</TableCell>
                                    <TableCell>
                                        <UpdateInventoryDialog sizeId={inventorySize.sizeId} productId={product.productVariant[0]._id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <Card className={"w-full"} >

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Size</TableHead>
                                <TableHead className="font-medium">Quantity</TableHead>
                                <TableHead>Update</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rightColumnData.map((inventorySize) => (
                                <TableRow key={inventorySize.sizeId} className={'font-sans'}>
                                    <TableCell>{inventorySize.size}</TableCell>
                                    <TableCell className="font-medium">{inventorySize.quantity}</TableCell>
                                    <TableCell>
                                        <UpdateInventoryDialog sizeId={inventorySize.sizeId} productId={product.productVariant[0]._id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>

    );
};

export default ProductInventoryForm;