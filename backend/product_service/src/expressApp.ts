import express from 'express'
import ColorRoutes from './api/colors.routes'
import BrandRoutes from './api/brands.routes'
import CategoryRoutes from './api/category.routes'
import CollectionRoutes from './api/collections.routes'
import FeaturesRoutes from './api/features.routes'
import SizeTypeRoutes from './api/sizeType.routs'
import ProductRoutes from './api/product.routes'
import ProductVariantRoutes from './api/productVariant.routes'
import GenderRoutes from './api/gender.routes'
import InventoryRoutes from './api/inventory.routes'
import CartRoutes from './api/cart.routes'
import PaymentRoutes from './api/payment.routes'
import DiscountRoutes from './api/discount.routes'

const app = express()
app.use(express.json())
app.use('/color', ColorRoutes)
app.use('/brand',BrandRoutes )
app.use('/category',CategoryRoutes )
app.use("/collection", CollectionRoutes)
app.use('/feature', FeaturesRoutes)
app.use('/size', SizeTypeRoutes)
app.use("/prod", ProductRoutes)
app.use('/variant',ProductVariantRoutes)
app.use('/gender', GenderRoutes)
app.use('/inventory', InventoryRoutes)
app.use("/cart", CartRoutes)
app.use("/payments",PaymentRoutes)
app.use("/discount", DiscountRoutes)
export default app;
