import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge";
import BoxSvg from "../components/SVG/BoxSVG.tsx";
import CardSvg from "../components/SVG/CardSVG.tsx";
import PointSVG from "../components/SVG/PointSVG.tsx";
import User from "../components/SVG/User.tsx";
import {DiscountInfo} from "../types/product.type.ts";
import CartSVG from "../components/SVG/CartSVG.tsx";
import HoodiPicture
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Mens_Hoodies.jpg";
import pantsPicture
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Mens_Pants.jpg";
import TeesPicture
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Mens_Tees.jpg";
import shortPicture
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Mens_Shorts.jpg";
import shortPictureWoman
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Womens_Shorts.jpg";

import leggingsPictureWoman
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Womens_Leggings.jpg";

import hoodiesPictureWoman
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Womens_Hoodies.jpg";

import teesPictureWoman
  from "../components/pages/Product/component/ProductViewListAdditional/Images/16166_Comp_X_Womens_Tees.jpg";

import homeHoodiesPicture from '../components/pictures/black-white-hoodies-white-background_1077884-17384.jpg'
import homeShoesPicture from '../components/pictures/NB-890_Comp_X1_Image4.jpg'
import jacketsShoesPicture from '../components/pictures/NB-890_Comp_X6_Image1.jpg'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const roundToTwoDecimalPlaces = (value: number): number =>{
  return Math.floor(value * 100) / 100;
}

export const navList = [
  {
    name:"Men",
    url:"/products/gender/men"
  },
  {
    name:"Woman",
    url:"/products/gender/woman"
  },
  {
    name:"Products",
    url:"/products"
  },
  {
    name:"Profile",
    url:"/account/details"
  }
]
export const HomeList = [

  {
    picture:homeShoesPicture,
    url:"/products/category/shoes",
    name:"Shoes"
  },
  {
    picture:jacketsShoesPicture,
    url:"/products/category/jacket",
    name:"Jackets"
  },
  {
    picture:homeHoodiesPicture,
    url:"/products/category/hoodies",
    name:"Hoodies"
  },
]
export function isDiscountActive(discount: DiscountInfo): boolean {
  const currentDate = new Date(); // Локальная дата
  const currentUTCDate = new Date(currentDate.toISOString()); // Преобразуем в UTC

  const beginAt = new Date(discount.beginAt); // Преобразуем строку в Date
  const finishAt = new Date(discount.finishAt); // Преобразуем строку в Date


  return (
      discount.active &&
      currentUTCDate >= beginAt &&
      currentUTCDate <= finishAt
  );
}

export function calculateDiscountedPrice(price: number, discountPercent: number): number {
  // Рассчитываем цену с учетом скидки
  const discountedPrice = price - (price * discountPercent / 100);

  // Округляем до двух знаков после запятой
  return Math.round(discountedPrice * 100) / 100;
}

export const menListCategory = [
  {
    picture:HoodiPicture,
    url:"hoodies",
    name:"Hoodies"
  },
  {
    picture:pantsPicture,
    url:"pants",
    name:"Pants"
  },
  {
    picture:TeesPicture,
    url:"t-shirts",
    name:"T-Shirts"
  },
  {
    picture:shortPicture,
    url:"shorts",
    name:"Shorts"
  },
]

export const womanListCategory = [
  {
    picture:hoodiesPictureWoman,
    url:"hoodies",
    name:"Hoodies"
  },
  {
    picture:leggingsPictureWoman,
    url:"leggings",
    name:"Leggings"
  },
  {
    picture:shortPictureWoman,
    url:"shorts",
    name:"Shorts"
  },
  {
    picture:teesPictureWoman,
    url:"t-shirts",
    name:"T-Shirts"
  },
]


export const AddressShop = "in bishkek park eleene[lj lajdskfj lajflsa;sfas fsfsaf"
export const  profileNavigateItems = [
  {
    svg: BoxSvg() ,
    title:"Orders",
    value:"orders",
  },
  {
    svg:User({className:" "}),
    title:"Personal details",
    value:"details",
  },
  {
    svg:CardSvg(),
    title:"Payments",
    value:"payments",
  },
  {
    svg:PointSVG(),
    title:"Addresses",
    value:"addresses",
  },
  {
    svg:CartSVG(),
    title:"Cart",
    value:"cart"
  }
]

export const  adminProfileNavigateItems = [
  {
    title:"Brand",
    value:"brand",
  },

  {
    title:"Collection",
    value:"collection",
  },

  {
    title:"Gender",
    value:"gender",
  },

  {
    title:"Category",
    value:"category",
  },

  {
    title:"Color",
    value:"color",
  },
  {
    title:"Sizes",
    value:"sizes",
  },
  {
    title:"Product",
    value:"product"
  },
  {
    title:"Employers",
    value:"employer"
  },
  {
    title:"Payments",
    value:"payment"
  },
  {
    title:"Payments Statistic",
    value:"static"
  },
  {
    title:"User Statistic",
    value:"user-static"
  },


]

export const userRole = [
  {
    name:"User",
    _id:"user"
  },
  {
    name:"Admin",
    _id:"admin"
  },
  {
    name:"Employer",
    _id:"employer"
  },

]


export const shippingStatus = [
  {
    name:"in process",
    _id:"in process"
  },
  {
    name:"finished",
    _id:"finished"
  },
  {
    name:"self-pickup",
    _id:"self-pickup"
  },
  {
    name:"picked up",
    _id:"picked up"
  },

]

export const paymentStatus = [
  {
    name:"succeeded",
    _id:"succeeded"
  },
  {
    name:"returned",
    _id:"returned"
  },

]


export function capitalizeFirstLetter(str:string) {
  if (!str) return str; // Если строка пуста, возвращаем её как есть
  return str.charAt(0).toUpperCase() + str.slice(1);
}
