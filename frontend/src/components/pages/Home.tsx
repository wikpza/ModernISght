import  {useState, useEffect} from 'react';
import CustomButton from '../ui/CustomButton.tsx';
import HomeCarouselCategory from "./Home/HomeCarouselCategory.tsx";
import GenderHomeList from "./Home/GenderHomeList.tsx";
import RecommendedProductList from "../elements/RecommendedProductList.tsx";
import {useNavigate} from "react-router-dom";


const Home =  () => {
    const navigate = useNavigate()
    const [backPosition, setBackPosition] = useState(
        window.innerWidth > 1024
        ? "50% 80%"
            :"center"
    )
    const [imageUrl, setImageUrl] = useState(
        window.innerWidth > 1024
            ? 'https://www.newbalance.com/dw/image/v2/AAGI_PRD/on/demandware.static/-/Library-Sites-NBUS-NBCA/default/dw8ada2774/images/page-designer/2024/July/16591_Comp_A_Desktop.jpg?sw=1616&sfrm=jpg'
            : 'https://www.newbalance.com/dw/image/v2/AAGI_PRD/on/demandware.static/-/Library-Sites-NBUS-NBCA/default/dwa7545fe0/images/page-designer/2024/July/16591_Comp_A_Mobile.jpg?sw=991&sfrm=jpg'
    );
    useEffect(() => {
        const handleResize = () => {
            setImageUrl(
                window.innerWidth > 1024
                    ? 'https://www.newbalance.com/dw/image/v2/AAGI_PRD/on/demandware.static/-/Library-Sites-NBUS-NBCA/default/dw8ada2774/images/page-designer/2024/July/16591_Comp_A_Desktop.jpg?sw=1616&sfrm=jpg'
                    : 'https://www.newbalance.com/dw/image/v2/AAGI_PRD/on/demandware.static/-/Library-Sites-NBUS-NBCA/default/dwa7545fe0/images/page-designer/2024/July/16591_Comp_A_Mobile.jpg?sw=991&sfrm=jpg'
            );
            setBackPosition(
                window.innerWidth > 1024
                    ? "50% 80%"
                    :"center"
            )
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            <section className={'relative flex-1'}>
                <section
                    className={'w-full sm:min-h-[600px] bg-cover min-h-96'}
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: backPosition,
                    }}
                ></section>

                <div
                    className={'static lg:w-2/5 lg:absolute lg:-translate-y-2/4 p-6 w-full'}
                    style={{
                        top: '50%',
                        left: '10%',
                    }}
                >
                    <div>
                        <h1 className={'text-5xl lg:text-white'}>The Fresh Foam X 1080</h1>
                        <span className={'block lg:text-white text-sm my-6'}>
                        Our best running shoe - in new colors.
                    </span>
                        <div onClick={()=>navigate("/products/6759b4eca51635723f2f037f/6759b502a51635723f2f03a5#")}>
                            <CustomButton className={'min-w-full lg:min-w-44 p-4 '}>Shop now</CustomButton>
                        </div>
                    </div>
                </div>
            </section>

            <section className={'mt-20'}>
               <HomeCarouselCategory/>
            </section>

            <section className={'mt-20'}>
                <GenderHomeList/>
            </section>

            <section className={'mt-20'}>
                <RecommendedProductList />
            </section>
        </div>

    );
}

export default Home;
