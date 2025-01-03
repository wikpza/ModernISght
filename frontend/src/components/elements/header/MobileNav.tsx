import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTrigger
} from "../../ui/sheet.tsx";
import {Menu} from "lucide-react";
import MobileNavLinks from "./MobileNavLinks.tsx";
const MobileNav = () => {


    return (
        <Sheet >
            <SheetTrigger >
               <Menu className={'black'}/>
            </SheetTrigger>
            <SheetContent style={{zIndex:1000}} className={'mobileNav'}>
                <SheetHeader className={"flex justify-center items-center"}>
                    <div className="logo-holder logo-6 text-nowrap w-fit">
                        <h3>Modern <span className={'block'}>Sight</span></h3>
                    </div>
                </SheetHeader>

                <SheetDescription className={'mt-10'}>
                    <MobileNavLinks/>
                </SheetDescription>

            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;