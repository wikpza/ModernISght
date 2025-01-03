import Home from "../components/pages/Home.tsx";
import User from "../components/pages/User/User.tsx";
import Address from "../components/pages/myAccount/Address.tsx";
import PersonalDetails from "../components/pages/myAccount/PersonalDetails.tsx";
import Orders from "../components/pages/myAccount/Orders.tsx";
import Payments from "../components/pages/myAccount/Payments.tsx";
import BrandPage from "../components/pages/admin/Brand/BrandPage.tsx";
import CollectionPage from "../components/pages/admin/collection/CollectionPage.tsx";
import GenderPage from "../components/pages/admin/Gender/GenderPage.tsx";
import CategoryPage from "../components/pages/admin/Category/CategoryPage.tsx";
import ColorPage from "../components/pages/admin/Color/ColorPage.tsx";
import SizesPage from "../components/pages/admin/Sizes/SizesPage.tsx";
import ProductPage from "../components/pages/admin/Product/ProductPage.tsx";
import CreateProductVariantPage from "../components/pages/admin/ProductVariant/CreateProductVariantPage.tsx";
import UpdateProductVariantPage from "../components/pages/admin/ProductVariant/UpdateProductVariantPage.tsx";
import ProductViewPage from "../components/pages/Product/ProductViewPage.tsx";
import ProductPersonalPage from "../components/pages/ProductPersonalPage/ProductPersonalPage.tsx";
import CartPage from "../components/pages/myAccount/Cart/CartPage.tsx";
import PaymentPage from "../components/pages/Payments/PaymentPage.tsx";
import AdminPaymentPage from "../components/pages/admin/Payment/AdminPaymentPage.tsx";
import AdminViewEmployerPage from "../components/pages/admin/Employer/AdminViewEmployerPage.tsx";
import AdminStatisticPage from "../components/pages/admin/Statistic/AdminStatisticPage.tsx";
import UserStatisticPage from "../components/pages/admin/UserStatistic/UserStatisticPage.tsx";


export const publicRoutes = [
    {
        path: '/',
        Component: Home,
    },
    {
        path: '/user',
        Component: User
    },
    {
        path:"/products",
        Component:ProductViewPage
    },
    {
        path: '/products/:productId/:variantId',
        Component: ProductPersonalPage
    },
    {
        path: '/products/category/:category/gender/:gender',
        Component: ProductViewPage
    },
    {
        path: '/products/category/:category',
        Component: ProductViewPage
    },
    {
        path: '/products/gender/:gender',
        Component: ProductViewPage
    },

];


export const userRoutes = [

    {
        path: '/account/addresses',
        Component: Address,
    },
    {
        path:"/payment",
        Component: PaymentPage
    },
    {
        path: '/account/details',
        Component: PersonalDetails,
    },
    {
        path: '/account/orders',
        Component: Orders,
    },
    {
        path: '/account/payments',
        Component: Payments,
    },
    {
        path: '/account/cart',
        Component: CartPage,
    },
];

export const adminRoutes = [

    {
        path: '/admin/brand',
        Component: BrandPage,
    },

    {
        path: '/admin/collection',
        Component: CollectionPage,
    },

    {
        path: '/admin',
        Component: BrandPage,
    },

    {
        path: '/admin/gender',
        Component: GenderPage,
    },

    {
        path: '/admin/category',
        Component: CategoryPage,
    },

    {
        path: '/admin/color',
        Component: ColorPage,
    },
    {
        path: '/admin/sizes',
        Component: SizesPage,
    },
    {
        path:'/admin/product',
        Component: ProductPage
    },
    {
        path:'/admin/product/new/:id',
        Component: CreateProductVariantPage
    },
    {
        path:'/admin/product/:productId/:variantId',
        Component: UpdateProductVariantPage
    },
    {
        path:'/admin/employer',
        Component: AdminViewEmployerPage
    },
    {
        path:'/admin/payment',
        Component: AdminPaymentPage
    },
    {
        path:'/admin/static',
        Component: AdminStatisticPage
    },
    {
        path:'/admin/user-static',
        Component: UserStatisticPage
    },
    // {
    //     path: '/admin/collection',
    //     Component: Orders,
    // },
    // {
    //     path: '/admin/gender',
    //     Component: Payments,
    // },
    // {
    //     path: '/admin/category',
    //     Component: Payments,
    // },
    // {
    //     path: '/admin/size',
    //     Component: Payments,
    // },
    // {
    //     path: '/admin/product',
    //     Component: Payments,
    // },
];
