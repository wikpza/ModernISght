import ProfilePanel from "../elements/profileDetails/ProfilePanel.tsx";
import {ScrollArea, ScrollBar} from "../ui/scroll-area.tsx";
import {profileNavigateItems} from "../../lib/utils.ts";
import ProfileNavigate from "../elements/profileDetails/ProfileNavigate.tsx";
import React from "react";
import {useLocation} from "react-router-dom";
type Props = {
    children: React.ReactNode,
    className:string
}
const AccountLayout = ({children, className = ""}:Props) => {
    const { pathname } = useLocation(); // Получаем текущий путь из react-router-dom
    const currentUrl = pathname.split('/').slice(-1)[0]

    return (
        <div className={'mx-auto max-w-[1440px] p-5'}>
            <ProfilePanel/>
            <div className={'flex lg:flex-row flex-col '}>
                <ScrollArea>
                    <section
                        className={' space-x-3  lg:space-x-0  lg:space-y-2 space-y-0  flex flex-row lg:flex-col lg:mr-28 mr-0 mb-7 lg:mb-0 '}>
                        {profileNavigateItems.map(({svg, title, value}) => (
                            <ProfileNavigate key={title} svg={svg} title={title} value = {value}
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
        </div>
    );
};

export default AccountLayout;