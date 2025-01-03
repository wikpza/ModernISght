import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../ui/card.tsx";
import { DiscountInfo } from "../../../../types/product.type.ts";
import { Input } from "../../../ui/input.tsx";
import { Button } from "../../../ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover.tsx";
import { Calendar } from "../../../ui/calendar.tsx";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../../../lib/utils.ts";
import { format } from "date-fns";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../ui/accordion.tsx";
import {Checkbox} from "../../../ui/checkbox.tsx";
import {useCreateDiscount} from "../../../../api/discountAPI.tsx";
import {PacmanLoader} from "react-spinners";
import {toast} from "sonner";

type Props = {
    productId: string;
    discount: DiscountInfo | undefined;
};

const ProductVariantDiscount = ({ productId ,discount }: Props) => {
    const {createDiscount, isLoading, isSuccess} = useCreateDiscount()
    const [discountInfo, setDiscountInfo] = useState<DiscountInfo>({
        name: "",
        description: "",
        percent: 0,
        active: false,
        beginAt: new Date(),
        finishAt: new Date(),
    });

    useEffect(() => {
        if (discount) {
            setDiscountInfo({
                ...discount,
                beginAt:new Date(discount.beginAt),
                finishAt: new Date(discount.finishAt)
            });
        }
    }, [discount]);

    if(isSuccess) window.location.reload()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        // Проверяем, является ли введенное значение числом
        if (!isNaN(parseFloat(newValue)) || newValue === '') {
            setDiscountInfo((prev) => ({ ...prev, percent: newValue === '' ? 0 : parseFloat(newValue) }));
        }
    };

    // Обработчик изменения даты начала
    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setDiscountInfo((prev) => ({ ...prev, beginAt: date }));
        }
    };

    const handleSubmit = () => {
        if(discountInfo.name === ""){
            toast.error("input the name of the discount")
            return
        }

        if(discountInfo.description === ""){
            toast.error("input the description of the discount")
            return
        }

       if(discountInfo.percent <= 0){
           toast.error("percent can not be less than 0")
           return
       }
        if(discountInfo.percent >= 100){
            toast.error("percent can not be more than 100")
            return
        }

        if (discountInfo.beginAt >= discountInfo.finishAt) {
            toast.error("The begin date must be earlier than the finish date.");
            return
        }

        // Проверка, что даты не совпадают по дням
        const beginDay = discountInfo.beginAt.toISOString().split("T")[0];
        const finishDay =discountInfo.finishAt.toISOString().split("T")[0];
        if (beginDay === finishDay) {
            toast.error("The begin date and finish date cannot be on the same day.");
            return false;
        }
        createDiscount(
            {
                discount:discountInfo,
                productId:productId
            })

    };
    const handleDateChangeFinish = (date: Date | undefined) => {
        if (date) {
            setDiscountInfo((prev) => ({ ...prev, finishAt: date }));
        }
    };

    return (
        <Accordion type="single" collapsible >
            <AccordionItem value="item-1" className={'border-black'}>
                <AccordionTrigger>Set Discount</AccordionTrigger>
                <AccordionContent>
                    <Card className={'border-gray-600'}>
                        <CardHeader>
                            <CardTitle>Discount</CardTitle>
                            <CardDescription>Set Discount</CardDescription>
                        </CardHeader>
                        <CardContent className={'space-y-4'}>
                            <div>
                                <div>Name</div>
                                <Input value={discountInfo.name}
                                       className={'border-gray-400'}
                                       onChange={(e) => setDiscountInfo({...discountInfo, name: e.target.value})}/>
                            </div>

                            <div>
                                <div>Description</div>
                                <Input value={discountInfo.description}
                                       className={'border-gray-400'}
                                       onChange={(e) => setDiscountInfo({
                                           ...discountInfo,
                                           description: e.target.value
                                       })}/>
                            </div>

                            <div className={'flex items-center'}>
                                <div className={'mr-3'}>Percent</div>
                                <Input value={discountInfo.percent}
                                       className={'border-gray-400'}
                                       onChange={handleChange}
                                       type="number"
                                       min={0}
                                       step="0.01"/>
                            </div>

                            <div className={'flex items-center '}>
                                <div className={'mr-3'}>Begin at</div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal border-gray-400",
                                                !discountInfo.beginAt && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon/>
                                            {discountInfo.beginAt ? format(discountInfo.beginAt, "PPP") :
                                                <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            className={'border-gray-400'}
                                            mode="single"
                                            selected={discountInfo.beginAt}
                                            onSelect={handleDateChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>


                            <div className={'flex items-center '}>
                                <div className={'mr-3'}>Finish at</div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal border-gray-400",
                                                !discountInfo.finishAt && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon/>
                                            {discountInfo.finishAt ? format(discountInfo.finishAt, "PPP") :
                                                <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            className={'border-gray-400'}
                                            mode="single"
                                            selected={discountInfo.finishAt}
                                            onSelect={handleDateChangeFinish}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <section className={'flex items-center'}>
                                <Checkbox
                                    onCheckedChange={() => setDiscountInfo({
                                        ...discountInfo,
                                        active: !discountInfo.active
                                    })}
                                    checked={discountInfo.active} className={'mr-3'}></Checkbox>
                                <div> is active</div>
                            </section>

                        </CardContent>
                        <CardFooter className={'flex justify-center'}>

                            {isLoading ?
                                <div
                                    className={'w-full h-[70px] bg-red-600 flex justify-center items-center align-middle '}>
                                    <PacmanLoader className={'!block text-2xl mx-auto'}/>
                                </div>
                            :
                                <Button
                                    className={'max-w-[230px] w-full  bg-blue-700 hover:bg-blue-900 transition-all duration-150 rounded text-base'}
                                    onClick={handleSubmit}
                                >Schedule a discount
                                </Button>
                            }


                        </CardFooter>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default ProductVariantDiscount;
