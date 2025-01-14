
import {useLocation} from "react-router-dom";
import ProfilePanel from "../../../elements/profileDetails/ProfilePanel.tsx";
import {ScrollArea, ScrollBar} from "../../../ui/scroll-area.tsx";
import {adminProfileNavigateItems} from "../../../../lib/utils.ts";
import ProfileNavigate from "../../../elements/profileDetails/ProfileNavigate.tsx";
type Props = {
    children: React.ReactNode,
    className:string
}
const AdminLayout = ({children, className = ""}:Props) => {
    const { pathname } = useLocation(); // Получаем текущий путь из react-router-dom
    const currentUrl = pathname.split('/').slice(-1)[0]

    return (
        <div className={'mx-auto max-w-[1440px] p-5'}>
            <ProfilePanel input={"Admin panel"}/>

            <div className={'flex flex-col lg:hidden'}>
                <ScrollArea>
                    <section
                        className={' space-x-3  lg:space-x-0  lg:space-y-2 space-y-0  flex flex-row lg:flex-col lg:mr-28 mr-0 mb-7 lg:mb-0 '}>
                        {adminProfileNavigateItems.map(({title, value}) => (
                            <ProfileNavigate key={title} title={title} value={value} navigateTo={"admin"}
                                             isActivated={currentUrl === value || currentUrl.startsWith(`${value}/`)}
                            />
                        ))}
                    </section>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
                <div className={className}>
                    {children}
                </div>
            </div>

            <div className={' lg:flex-row flex-col hidden lg:flex'}>
                    <section
                        className={' space-x-3  lg:space-x-0  lg:space-y-2 space-y-0  flex  flex-col mr-10 mb-7 lg:mb-0 '}>
                        {adminProfileNavigateItems.map(({title, value}) => (
                            <ProfileNavigate key={title} title={title} value={value} navigateTo={"admin"}
                                             isActivated={currentUrl === value || currentUrl.startsWith(`${value}/`)}
                            />
                        ))}
                    </section>
                <div className={className}>
                    {children}
                </div>
            </div>

        </div>
    );
};

export default AdminLayout;