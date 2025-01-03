import express, {Request, Response, NextFunction} from 'express'
import addressRoutes from '../src/api/address.routes'
import cardRoutes from './api/card.routes'
import userRoutes from './api/user.routes'
import adminRoutes from './api/admin.routes'


const app = express();
app.use(express.json())
app.use('/user',userRoutes)
app.use('/user/addresses',addressRoutes)
app.use('/user/cards', cardRoutes)
app.use('/user/admin',adminRoutes )


export default app