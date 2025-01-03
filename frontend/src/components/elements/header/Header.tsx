import MainNav from "./MainNav.tsx";
import MobileNav from "./MobileNav.tsx";
import AdditionalHeader from "../../layout/AdditionalHeader.tsx";
import BasketSVG from "../../SVG/BasketSVG.tsx";
import {useNavigate} from "react-router-dom";


const Header = () => {
    const navigate = useNavigate()
    return (

            <div className={'flex sticky  flex-col bg-white border-b border-gray-300'} style={{zIndex:"50", top:"0px"}}>
                <AdditionalHeader/>

                <section>
                    <div
                        className={'container mx-auto flex  items-center px-3 justify-between md:justify-around h-[81px]'}>


                        <div className="logo-holder logo-6 text-nowrap w-fit"
                        onClick={()=>navigate("/home")}>
                                <h3>Modern <span className={'block'}>Sight</span></h3>
                        </div>

                        <div className={'hidden md:block w-full h-full'}>
                            <MainNav/>
                        </div>
                        <div className={'flex flex-row'}>
                            <div
                            onClick={()=>navigate(('/account/cart'))}>
                                <BasketSVG className="md:ml-9 mr-5 md:mr-0"/>
                            </div>

                            <div className={'md:hidden'}>
                                <MobileNav/>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

    )
        ;
};

export default Header;