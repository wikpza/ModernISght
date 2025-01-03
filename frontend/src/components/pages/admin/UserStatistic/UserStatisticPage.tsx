import AdminLayout from "../component/AdminLayout.tsx";
import {Card} from "../../../ui/card.tsx";
import UserRoleStatic from "./component/UserRoleStatic.tsx";
import {useGetUsersRoleCountStatic} from "../../../../api/AdminAPI.tsx";
import UserRegisteredChart from "./component/UserRegisteredChart.tsx";
import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "../../../ui/popover.tsx";
import {Button} from "../../../ui/button.tsx";
import {cn} from "../../../../lib/utils.ts";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "../../../ui/calendar.tsx";

const UserStatisticPage = () => {
    const [params, setParams] = useState<{toDate:Date, fromDate:Date}>(
        {
        fromDate:new Date(),
            toDate:new Date()
    }
    )
    const {users, refetch} = useGetUsersRoleCountStatic(params)

    if(!users) return (
        <div>
        is Loading
    </div>)

    const ChangeValue = async (data:{toDate:Date, fromDate:Date})=>{
        setParams({...params, ...data})
    }
    const refreshData = async(data:{toDate:Date, fromDate:Date})=>{
        await ChangeValue(data).then(()=>refetch())
    }


    return (
        <AdminLayout className={"w-full"}>
            <div className={'flex'}>

                <Card className="w-fit mb-10 cardShadow">
                    <UserRoleStatic/>
                </Card>

            </div>


            <Card className="h-auto mb-10 cardShadow w-full max-w-[700px] p-5">
                <div className="w-fit mb-10  ">
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
                                    onSelect={(date) => {
                                        refreshData(date ? {...params, fromDate: date} : params)

                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className={'flex items-center justify-between mb-3 font-sans'}>
                        <div className={'mr-3'}>To Date</div>
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
                                    {params.fromDate ? format(params.toDate, "PPP") :
                                        <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    className={'border-gray-400'}
                                    mode="single"
                                    selected={params.toDate}
                                    onSelect={(date) => {
                                        refreshData(date ? {...params, toDate: date} : params)

                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <UserRegisteredChart users={users.data ? users.data : []}/>
            </Card>

        </AdminLayout>
    );
};

export default UserStatisticPage;