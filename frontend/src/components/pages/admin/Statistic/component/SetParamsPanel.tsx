import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../../ui/card.tsx";
import {Label} from "../../../../ui/label.tsx";
import CustomCombobox from "../../../../elements/ComboboxCustom.tsx";
import {cn, paymentStatus, shippingStatus} from "../../../../../lib/utils.ts";
import {useGetCategories} from "../../../../../api/CategoryApi.tsx";
import {PaymentStat} from "./PaymentStatisticGrapth.tsx";
import {useGetGenders} from "../../../../../api/GenderAPI.tsx";
import {useGetCollections} from "../../../../../api/CollectionApi.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../../../ui/accordion.tsx";
import {useGetBrands} from "../../../../../api/BrandApi.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "../../../../ui/popover.tsx";
import {Button} from "../../../../ui/button.tsx";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "../../../../ui/calendar.tsx";




type Props = {
    params: PaymentStat

    setParams:( input:PaymentStat)=>void

    refetch: ()=>void

}




const SetParamsPanel = ({params, setParams, refetch}:Props) => {
    const {categories} = useGetCategories()
    const {genders} = useGetGenders()
    const {collections} = useGetCollections()
    const {brands} = useGetBrands()
    const ChangeValue = async (data:PaymentStat)=>{
        setParams({...params, ...data})
    }
    const refreshData = async(data:PaymentStat)=>{
        await ChangeValue(data).then(()=>refetch())
    }
    return (
        <div>
            <Card className="max-w-[600px] mb-10 cardShadow">
                <CardHeader>
                    <CardTitle className={'text-2xl'}>Payments</CardTitle>
                    <CardDescription>Set Params to find payments.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form className={'mb-5'}>
                        <div className=" w-full gap-4 flex flex-col sm:flex-row ">

                            <div className="flex flex-col space-y-1.5 w-full font-sans">
                                <Label htmlFor="framework">Status</Label>
                                <CustomCombobox
                                    listOfValue={paymentStatus}
                                    selectedName={{
                                        name: params.status,
                                        _id: params.status
                                    }}
                                    setName={async (val) => {
                                        refreshData({...params, status: val._id})

                                    }}
                                    optionName={"Status"}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5 w-full font-sans">
                                <Label htmlFor="framework">Shipping Status</Label>
                                <CustomCombobox
                                    listOfValue={shippingStatus}
                                    selectedName={{
                                        name: params.shippingStatus,
                                        _id: params.shippingStatus
                                    }}
                                    setName={async (val) => {
                                        refreshData({...params, shippingStatus: val._id})

                                    }}
                                    optionName={"Shipping Status"}
                                />
                            </div>


                        </div>
                    </form>
                    <div className={'flex items-center justify-between mb-3 font-sans'}>
                        <div className={'mr-3'}>From Date</div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal border-gray-400",
                                        !params.fromDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon/>
                                    {params.fromDate ? format(params.fromDate, "PPP") :
                                        <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    className={'border-gray-400'}
                                    mode="single"
                                    selected={params.fromDate}
                                    onSelect={(date)=>{
                                        refreshData(date?{...params, fromDate:date}:params)

                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className={'flex items-center justify-between font-sans'}>
                        <div className={'mr-3'}>to Date</div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal border-gray-400",
                                        !params.toDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon/>
                                    {params.toDate ? format(params.toDate, "PPP") :
                                        <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    className={'border-gray-400'}
                                    mode="single"
                                    selected={params.toDate}
                                    onSelect={(date)=>  refreshData(date?{...params, toDate:date}:params)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Accordion type="multiple">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Category</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col space-y-1.5 w-full font-sans">
                                    <CustomCombobox
                                        listOfValue={categories || []}
                                        selectedName={params.category}
                                        setName={async (val) => {
                                            refreshData({...params, category: val})

                                        }}
                                        optionName={"Category"}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Collections</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col space-y-1.5 w-full font-sans">
                                    <CustomCombobox
                                        listOfValue={collections || []}
                                        selectedName={params.collection}
                                        setName={async (val) => {
                                            refreshData({...params, collection: val})

                                        }}
                                        optionName={"Collection"}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Gender</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col space-y-1.5 w-full font-sans">
                                    <CustomCombobox
                                        listOfValue={genders || []}
                                        selectedName={params.gender}
                                        setName={async (val) => {
                                            refreshData({...params, gender: val})

                                        }}
                                        optionName={"Gender"}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Brands</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col space-y-1.5 w-full font-sans">
                                    <CustomCombobox
                                        listOfValue={brands || []}
                                        selectedName={params.brand}
                                        setName={async (val) => {
                                            refreshData({...params, brand: val})

                                        }}
                                        optionName={"Brand"}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>


        </div>
    );
};

export default SetParamsPanel;