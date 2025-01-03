
import Header from "../elements/header/Header.tsx";
import Footer from "../elements/footer/Footer.tsx";
import {LoadingOverlay} from "../elements/header/LoadingOverlay.tsx";
import {Toaster} from "sonner";
type Props = {
    children: React.ReactNode,
}

const layout = ({children}:Props) => {

    return (
        <LoadingOverlay>
            <Toaster  richColors position={'top-center'}/>
            <div className={'flex flex-col min-h-screen'}>
                <Header/>
                <div className={'container flex-1 px-0 max-w-[1600px]'}>
                    {children}
                </div>
                <Footer/>
            </div>
        </LoadingOverlay>
    )
}
export default layout