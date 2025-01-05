import express, {NextFunction, Request, Response} from "express"
import cors from 'cors'
import "dotenv/config"

const app = express()
app.use(express.json())
app.use(cors())

app.get("/test", async(req:Request, res:Response, next:NextFunction)=>{
    res.json({message:"hello world?"})
})

app.listen(8800, ()=>{
    console.log("server started on localhost: 7000")
})