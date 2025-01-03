
import express, {NextFunction, Request, Response} from 'express'
import sharp from "sharp";

import PictureRoutes from "./api/picture.routes";
const app = express()
app.use(express.json())
app.use('/picture', PictureRoutes)


export default app;
