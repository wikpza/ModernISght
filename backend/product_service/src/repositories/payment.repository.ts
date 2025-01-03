
import PaymentModel, {IAddress, IPayment, IPurchase} from "../database/schemas/payment.schema";
import {NotFoundError} from "../utils/error";
import {
    calculateDiscountedPrice, generatePaymentCode,
    isDiscountActive,
    isValidPaymentShippingStatus,
    isValidPaymentStatus,
    roundToTwoDecimalPlaces
} from "../utils";
import {fetchAddress, fetchCard, fetchUser} from "../api/httpRequest/payment.request";
import CartModel from "../database/schemas/cart.schema";
import InventoryModel from "../database/schemas/inventory.schema";
import ProductModel from "../database/schemas/product.schema";
import SizeTypeModel from "../database/schemas/sizeType.schema";
import {InventorySessionList} from "./inventory.repository";
import InventorySessionModel from "../database/schemas/inventorySession.schema";
import {Product} from "../models/product.model";
import GenderModel, {IGender} from "../database/schemas/genders.schema";
import {Gender} from "../models/gender.model";
import CollectionsModel from "../database/schemas/collections.schema";
import BrandsModel from "../database/schemas/brands.schema";
import CategoryModel from "../database/schemas/category.schema";


export class PaymentRepository{

    async createPayment(input:{userId:string, cardId:string, addressId:string, status:string, shippingStatus:string, token:string}){
        const cardExist = await fetchCard(input.cardId, input.token)
        if(!cardExist.status) throw new NotFoundError('not found bank card')

        let addressExist = undefined
        if(input.shippingStatus === "in process"){
            if(!input.addressId) throw new NotFoundError('not found address')
            addressExist = await fetchAddress(input.addressId, input.token)
            if(!addressExist.status) throw new NotFoundError('not found address')
        }

        const cartExist = await CartModel.findOne({userId:input.userId})
        if(!cartExist) throw new NotFoundError('you have not added anything to the cart')

        let productPrice = 0
        const purchaseL = cartExist.productList.map(async(product, index)=>{


            console.log(product.productVariantId)
            const productExist = await ProductModel.findOne({"productVariant._id":product.productVariantId})
            if(!productExist) throw new NotFoundError('product is not available 1')

            console.log(product.productVariantId);
            const matchingVariant = productExist.productVariant.find(variant => variant._id.toString() === product.productVariantId.toString())
            if(!matchingVariant) throw new NotFoundError('product is not available 2')

            const sizeTypeExist = await SizeTypeModel.findOne({categoryId:productExist.categoryId, genderId:productExist.genderId})
            if(!sizeTypeExist) throw new NotFoundError('product is not available 3')

            const matchingSize = sizeTypeExist.sizes.find(variant => variant._id.toString() === product.sizeId)
            if(!matchingSize) throw new NotFoundError('product is not available 4')

            const inventoryExist = await InventoryModel.findOne({productVariantId:matchingVariant._id, sizeId:matchingSize._id})
            if(!inventoryExist) throw new NotFoundError("product is not available 5")


            if(inventoryExist.quantity >= product.quantity){
                let productDiscPrice = matchingVariant.price

                if(matchingVariant.discountInfo && isDiscountActive(matchingVariant.discountInfo)){
                    productPrice = productPrice + roundToTwoDecimalPlaces(calculateDiscountedPrice(matchingVariant.price, matchingVariant.discountInfo.percent)*product.quantity)
                    productDiscPrice = calculateDiscountedPrice(matchingVariant.price, matchingVariant.discountInfo.percent)
                }else{
                    productPrice = productPrice + roundToTwoDecimalPlaces(matchingVariant.price*product.quantity)
                }
                return {
                    productVariantId:matchingVariant._id.toString(),
                    quantity:product.quantity,
                    sizeId:matchingSize._id.toString(),
                    totalPrice:roundToTwoDecimalPlaces(product.quantity * productDiscPrice),
                    productPrice:productDiscPrice
                } as IPurchase
            }
        })

        const purchaseList = await Promise.all(purchaseL);

        if(productPrice === 0){
            throw new NotFoundError('you have not added anything in cart')
        }


        for (const productElement of cartExist.productList){
            const productExist = await ProductModel.findOne({"productVariant._id":productElement.productVariantId})
            if(!productExist) continue

            const matchingVariant = productExist.productVariant.find(variant => variant._id.toString() === productElement.productVariantId.toString())
            if(!matchingVariant) continue

            const sizeTypeExist = await SizeTypeModel.findOne({categoryId:productExist.categoryId, genderId:productExist.genderId})
            if(!sizeTypeExist) continue

            const matchingSize = sizeTypeExist.sizes.find(variant => variant._id.toString() === productElement.sizeId)
            if(!matchingSize) continue

            const inventoryExist = await InventoryModel.findOne({productVariantId:matchingVariant._id, sizeId:matchingSize._id})
            if(!inventoryExist) throw new NotFoundError("product is not available 5")


            if(inventoryExist.quantity >= productElement.quantity){
                inventoryExist.quantity = inventoryExist.quantity - productElement.quantity
                await inventoryExist.save()

                await InventorySessionModel.create({
                    sizeId:matchingSize._id,
                    type:"buying",
                    quantity:productElement.quantity,
                    productVariantId:matchingVariant._id,
                    userId:input.userId,
                })
            }

        }

        if(purchaseList.length === 0) throw new NotFoundError('you have not added anything to the cart ')
        let shippingPrice = 0

        if(input.shippingStatus === "in process") {
            shippingPrice = roundToTwoDecimalPlaces(5*productPrice/100)
        }

        const paymentExist = await PaymentModel.create(
            {
                key:await generatePaymentCode(),
                userId:input.userId,
                purchases:purchaseList,
                cardNumber:cardExist.card.number,
                productPrice:productPrice,
                shippingPrice:shippingPrice,
                totalPrice:shippingPrice+productPrice,
                status:'succeeded',
                shippingStatus:input.shippingStatus,
            }
        )

        if(input.shippingStatus === "in process" && addressExist) {
            paymentExist.address = {
                firstName:addressExist.address.firstName,
                lastName: addressExist.address.lastName,
                addressLine1: addressExist.address.addressLine1,
                addressLine2:addressExist.address.addressLine2,
                city: addressExist.address.city,
                state: addressExist.address.state,
                zipCode:addressExist.address.zipCode,
                phoneNumber: addressExist.address.phoneNumber,
            } as IAddress
        }

        await CartModel.updateOne({userId:input.userId},{productList:[]})
        await paymentExist.save()
        return paymentExist
        return {}
    }
    async changeShippingStatus(input: { paymentId: string; newStatus: string}): Promise<IPayment> {
        const paymentExist = await PaymentModel.findById(input.paymentId);
        if (!paymentExist) {
            throw new NotFoundError('Payment with such ID not found');
        }

        // Проверяем, является ли новый статус допустимым
        if (!isValidPaymentShippingStatus(input.newStatus)) {
            throw new Error('Incorrect status format');
        }

        // Если статус корректен, обновляем его
        paymentExist.shippingStatus = input.newStatus;

        // Сохраняем изменения
        await paymentExist.save();

        // Возвращаем обновлённый платеж
        return paymentExist;
    }
    async changeStatus(input: { paymentId: string; newStatus: string, userId:string  }): Promise<IPayment> {
        const paymentExist = await PaymentModel.findById(input.paymentId);
        if (!paymentExist) {
            throw new NotFoundError('Payment with such ID not found');
        }

        // Проверяем, является ли новый статус допустимым
        if (!isValidPaymentStatus(input.newStatus)) {
            throw new Error('Incorrect status format');
        }

        // Если статус корректен, обновляем его
        paymentExist.status = input.newStatus;

        for (const productElement of paymentExist.purchases){
            const productExist = await ProductModel.findOne({"productVariant._id":productElement.productVariantId})
            if(!productExist) continue

            const matchingVariant = productExist.productVariant.find(variant => variant._id.toString() === productElement.productVariantId.toString())
            if(!matchingVariant) continue

            const sizeTypeExist = await SizeTypeModel.findOne({categoryId:productExist.categoryId, genderId:productExist.genderId})
            if(!sizeTypeExist) continue

            const matchingSize = sizeTypeExist.sizes.find(variant => variant._id.toString() === productElement.sizeId)
            if(!matchingSize) continue

            const inventoryExist = await InventoryModel.findOne({productVariantId:matchingVariant._id, sizeId:matchingSize._id})
            if(!inventoryExist) throw new NotFoundError("product is not available 5")


            inventoryExist.quantity = inventoryExist.quantity + productElement.quantity
            await inventoryExist.save()

            await InventorySessionModel.create({
                sizeId:matchingSize._id,
                type:"returning",
                quantity:productElement.quantity,
                productVariantId:matchingVariant._id,
                userId:input.userId,
            })


        }
        // Сохраняем изменения
        await paymentExist.save();

        // Возвращаем обновлённый платеж
        return paymentExist;
    }

    // async createPayment(input: {
    //     userId: string;
    //     token:string;
    //     purchases: [PurchaseList];
    //     cardNumber: string;
    //     cardId: string;
    //     addressId: string;
    //     shippingStatus: string
    // }): Promise<IPayment> {
    //     const userExist = await getUserById(input.userId, input.token)
    //     if(!userExist) throw new NotFoundError('not authorized user')
    //
    //     let cardNumber:string = ""
    //
    //     if(input.cardNumber) cardNumber = input.cardNumber
    //     else{
    //         const cardExist = await getCardDataById(input.cardId, input.token)
    //         if(!cardExist) throw new NotFoundError("haven't added the cart")
    //         cardNumber = cardExist.cardNumber
    //     }
    //
    //     if (!isValidPaymentShippingStatus(input.shippingStatus)) {
    //         throw new Error('Incorrect status format');
    //     }
    //
    //     if(!(input.shippingStatus === "self-pickup" || input.shippingStatus === "picked up") ){
    //         const addressExist = await getAddressById(input.addressId, input.token)
    //         if(!addressExist) throw new NotFoundError('not found address')
    //     }
    //
    //     const productsInventory = await getProductInventory(input.purchases, input.token)
    //     if(!productsInventory) throw new NotFoundError("product is available")
    //
    //     for (const purchase of input.purchases){
    //         if(productsInventory.sizes[purchase.sizeId] < purchase.quantity) throw new NotFoundError("The requested quantity is not available in stock.")
    //     }
    //
    //     const productsPrice = await getProductsPrice(input.purchases, input.token)
    //     if(!productsPrice) throw new NotFoundError('product is available')
    //     const productPriceList = []
    //     let totalPrice = 0
    //
    //     for(const purchase of input.purchases){
    //         const productPrice = productsPrice.find( (value) => value.sku === purchase.sku )
    //         if(!productPrice ) throw new NotFoundError('product is available')
    //         productPriceList.push(
    //             {
    //             sku:purchase.sku,
    //                 quantity:purchase.quantity,
    //                 sizeId:purchase.sizeId,
    //                 totalPrice:(productPrice.price * purchase.quantity)
    //         } as IPurchase)
    //         totalPrice = totalPrice + productPrice.price * purchase.quantity
    //     }
    //
    //     let shippingPrice = 0
    //     if(!(input.shippingStatus === "self-pickup" || input.shippingStatus === "picked up") )  shippingPrice = Math.floor(5*totalPrice/100)
    //
    //
    //
    //     const newPayment = await PaymentModel.create({
    //         userid:input.userId,
    //         purchases:productPriceList,
    //         cardNumber:cardNumber,
    //         productsPrice:totalPrice,
    //         shipping:shippingPrice,
    //         totalPrice:totalPrice + shippingPrice,
    //         shippingStatus:input.shippingStatus,
    //         status:"succeeded",
    //     })
    //
    //     if(!(input.shippingStatus === "self-pickup" || input.shippingStatus === "picked up") ) newPayment.addressId = input.addressId
    //
    //     await newPayment.save()
    //     return newPayment
    // }


    async getAdminPayments(input: {
        page: number;
        limit: number;
        token: string;
        shippingStatus?: string;
        status?: string;
        searchId?: string;
    }) {
        const { page, limit, shippingStatus, status, searchId } = input;

        // Устанавливаем фильтры
        const filters: Record<string, any> = {};
        if (shippingStatus) filters.shippingStatus = shippingStatus;
        if (status) filters.status = status;

        // Если указан searchId, используем $expr для поиска
        if (searchId) {
            filters.key = { $regex: searchId, $options: 'i' };
        }

        const skip = (page - 1) * limit;

        try {
            // Выполняем запрос
            const payments = await PaymentModel.find(filters)
                .skip(skip)
                .limit(limit)
                .exec();

            // Считаем общее количество документов
            const totalPayments = await PaymentModel.countDocuments(filters);

            // Маппим платежи и добавляем данные пользователя
            const result = await Promise.all(
                payments.map(async (item) => {


                    return {
                        key:item.key,
                        _id: item._id,
                        userId: item.userId,
                        cardNumber: item.cardNumber,
                        productPrice: item.productPrice,
                        shippingPrice: item.shippingPrice,
                        totalPrice: item.totalPrice,
                        status: item.status,
                        shippingStatus: item.shippingStatus,
                    };
                })
            );

            // Возвращаем результат
            return {
                data: result,
                totalPage: Math.ceil(totalPayments / limit),
            };
        } catch (error) {
            console.error('Ошибка при получении платежей:', error);
            throw new Error('Ошибка при запросе данных о платежах');
        }
    }

    async getAdminPaymentsStatic(input: {
        fromDate?:string,
        toDate?:string,
        token: string;
        shippingStatus?: string;
        status?: string;
        searchId?: string;
        brandId?:string,
        categoryId?: string;
        collectionId?:string,
        genderId?:string,
    }) {
        const { fromDate, toDate, shippingStatus, status, searchId, categoryId, genderId, collectionId, brandId } = input;

        const productExist = await ProductModel.find({})
        if(!productExist) return []

        const productList = []

        for(const productValue of productExist){
            if(productValue.productVariant.length === 0) continue

            for(const productVariantValue of productValue.productVariant){
                productList.push(productVariantValue)
            }

        }

        let totalPrice = 0

        const gendersExist:IGender[] = await GenderModel.find();
        const collectionsExist = await CollectionsModel.find()
        const brandExist = await BrandsModel.find()
        const categoryExist = await CategoryModel.find()

        let collections: { _id: string; name: string; count: number }[] = collectionsExist.map(gender => ({
            _id: gender._id? gender._id.toString():"" ,
            name: gender.name,
            count: 0,
        }));

        let genders: { _id: string; name: string; count: number }[] = gendersExist.map(gender => ({
            _id: gender._id? gender._id.toString():"" ,
            name: gender.name,
            count: 0,
        }));

        let brands: { _id: string; name: string; count: number }[] = brandExist.map(gender => ({
            _id: gender._id? gender._id.toString():"" ,
            name: gender.name,
            count: 0,
        }));

        let categories: { _id: string; name: string; count: number }[] = categoryExist.map(gender => ({
            _id: gender._id? gender._id.toString():"" ,
            name: gender.name,
            count: 0,
        }));



        const result = productList.map(async(product)=>{

            const productFilter:any = {"productVariant._id":product._id}

            if(categoryId && categoryId !== "" ) productFilter.categoryId = categoryId?.toString()
            if(genderId && genderId !== "" ) productFilter.genderId = genderId?.toString()
            if(collectionId && collectionId !== "" ) productFilter.collectionId = collectionId?.toString()
            if(brandId && brandId !== "" ) productFilter.brandId = brandId?.toString()

            const productExist = await ProductModel.findOne(productFilter) .populate('brandId', 'name')
                .populate('collectionId', 'name')
                .populate('categoryId', 'name')  // Заполняем поле categoryId с полем 'name'
                .populate('genderId', 'name')  // Заполняем поле genderId с полем 'name'
                .populate('brandId', 'name')  // Заполняем поле genderId с полем 'name'
                .populate({
                    path: 'productVariant.colorId',  // Заполняем поле colorId в productVariant
                    select: 'name hexCode'  // Указываем, какие поля из коллекции Color нам нужны
                })

            if(!productExist) return {}

            const matchingVariant = productExist.productVariant.find(variant => variant._id.toString() === product._id.toString())
            if(!matchingVariant) return {}

            const filter: any = {};

            if (fromDate && fromDate !== "" && toDate && toDate !== "") {
                const fromDateObj = new Date(fromDate);
                const toDateObj = new Date(toDate);

                console.log('fromDate:', fromDate, 'toDate:', toDate);
                console.log('fromDateObj:', new Date(fromDate), 'toDateObj:', new Date(toDate));

                if (!isNaN(fromDateObj.getTime()) && !isNaN(toDateObj.getTime())) {
                    filter.createdAt = { $gte: fromDateObj, $lte: toDateObj };
                } else {
                    throw new Error("Invalid date format");
                }
            }
            if (status && status !== "") filter.status = status;
            if (shippingStatus && shippingStatus !== "") filter.shippingStatus = shippingStatus;

            filter.purchases = { $elemMatch: { productVariantId: matchingVariant._id } };

            const paymentsExist = await PaymentModel.find(filter);

            let totalQuantity = 0

            let productPrice = 0

            if(paymentsExist && paymentsExist.length !== 0){
                for(const paymentElement of paymentsExist){

                    if(paymentElement.purchases.length === 0) continue

                    for(const paymentPurchase of paymentElement.purchases){

                       if(paymentPurchase.productVariantId.toString() === matchingVariant._id.toString()){
                           totalQuantity = totalQuantity + paymentPurchase.quantity
                           productPrice = productPrice + paymentPurchase.totalPrice

                           genders = genders.map(gender=>  productExist.genderId.equals(gender._id)? {...gender, count:gender.count+paymentPurchase.quantity}:gender)
                           brands = brands.map(brand=>  productExist.brandId.equals(brand._id)? {...brand, count:brand.count+paymentPurchase.quantity}:brand)
                           collections = collections.map(collection=>  productExist.collectionId.equals(collection._id)? {...collection, count:collection.count+paymentPurchase.quantity}:collection)
                           categories = categories.map(category=>  productExist.categoryId.equals(category._id)? {...category, count:category.count+paymentPurchase.quantity}:category)
                       }

                    }
                }
            }

            totalPrice = totalPrice + productPrice
            return {
                name:productExist.name,
                productId:productExist._id,
                images:matchingVariant.images,
                productVariant:matchingVariant._id,
                category:productExist.categoryId,
                gender:productExist.genderId,
                collection:productExist.collectionId,
                color:matchingVariant.colorId,
                status:status,
                shippingStatus:shippingStatus,
                totalQuantity:totalQuantity,
                totalPrice:productPrice
            }

        })
       return  {
            data:await Promise.all(result),
           totalPrice:totalPrice,
           genders:genders,
           brands,
           categories,
           collections,
        }
    }


    async getPaymentAdmin(input:{userId:string}){

    }
    async getPayments(input:{userId:string}){
        const paymentsExist = await PaymentModel.find({userId:input.userId}).sort({ createdAt: -1 });
        if(!paymentsExist) return {userId:input.userId, payments:[]}

        const paymentList = []

        for (let payment of paymentsExist)
        {
            const productList = []
            for (let productItem of payment.purchases){

                const product = await ProductModel.findOne({
                    "productVariant._id": productItem.productVariantId
                })
                    .populate('brandId', 'name')
                    .populate('collectionId', 'name')
                    .populate('categoryId', 'name')  // Заполняем поле categoryId с полем 'name'
                    .populate('genderId', 'name')  // Заполняем поле genderId с полем 'name'
                    .populate({
                        path: 'productVariant.colorId',  // Заполняем поле colorId в productVariant
                        select: 'name hexCode'  // Указываем, какие поля из коллекции Color нам нужны
                    })



                if (!product) {
                    throw new Error('Product not found');
                }

                const variant = product.productVariant.find((v) => v._id.equals(productItem.productVariantId));
                if (!variant) {
                    throw new Error('Product not found');
                }

                const sizeExist = await SizeTypeModel.findOne({
                    categoryId:product.categoryId._id,
                    genderId:product.genderId._id,
                    "sizes._id":productItem.sizeId
                })

                if (!sizeExist) {
                    throw new Error('size not found');
                }

                const sizeValue = sizeExist.sizes.find((v) => v._id.equals(productItem.sizeId));
                if (!sizeValue) {
                    throw new Error('size not found');
                }

                productList.push(
                    {
                        quantity:productItem.quantity,
                        product:{
                            _id:product._id,
                            rating:product.rating,
                            features:product.features,
                            collection:product.collectionId,
                            name:product.name,
                            active:product.active,
                            gender:product.genderId,
                            brand:product.brandId,
                            categoryId:product.categoryId,
                            productVariant:variant
                        },
                        size:{
                            _id:sizeValue._id,
                            name:sizeValue.size
                        },
                        productPrice:productItem.productPrice,
                        totalPrice: productItem.totalPrice

                    }
                )
            }

            paymentList.push(
                {
                    key:payment.key,
                    _id:payment._id,
                    purchases:productList,
                    cardNumber:payment.cardNumber,
                    productPrice:payment.productPrice,
                    shippingPrice:payment.shippingPrice,
                    totalPrice:payment.totalPrice,
                    status:payment.status,
                    shippingStatus:payment.shippingStatus,
                    address:payment.address,
                }
            )
        }




        return {
            userId:input.userId,
            payments:paymentList
        }

    }
    async getPaymentsHistory(input: {
        token: string;
        userId: [string];
        cardNumber: [string];
        status: [string];
        shippingStatus: [string];
        fromDate: Date;
        toDate: Date;
        offset: number;
        page: number;
        sku: [string];
    }): Promise<IPayment[]> {
        const {
            userId,
            cardNumber,
            status,
            shippingStatus,
            fromDate,
            toDate,
            offset,
            page,
            sku
        } = input;

        // Строим объект фильтрации
        const filter: any = {};

        // Фильтрация по userId
        if (userId && userId.length > 0) {
            filter.userId = { $in: userId };
        }

        // Фильтрация по cardNumber
        if (cardNumber && cardNumber.length > 0) {
            filter.cardNumber = { $in: cardNumber };
        }

        // Фильтрация по статусу
        if (status && status.length > 0) {
            filter.status = { $in: status };
        }

        // Фильтрация по shippingStatus
        if (shippingStatus && shippingStatus.length > 0) {
            filter.shippingStatus = { $in: shippingStatus };
        }

        // Фильтрация по дате
        if (fromDate && toDate) {
            filter.createdAt = { $gte: fromDate, $lte: toDate };
        }

        // Фильтрация по sku в purchases (если передано)
        if (sku && sku.length > 0) {
            filter.purchases = {
                $elemMatch: {
                    sku: { $in: sku }
                }
            };
        }

        // Пагинация: skip и limit
        const limit = 10;
        const skip = (page - 1) * limit + offset;

        // Выполняем поиск с фильтрацией и пагинацией
        const payments = await PaymentModel.find(filter)
            .skip(skip)
            .limit(limit)
            .exec();

        if (!payments) return [];

        // Возвращаем результаты
        return payments;
    }


    async getPaymentsHistoryUser(input: { userId: string }): Promise<IPayment[]> {
        const payments = await PaymentModel.find({userId:input.userId})

        if(!payments) return []
        return payments
    }

}