
import dotenv from 'dotenv'
import expressApp from "./expressApp";
import connectDB from "./database";
import {producer} from "./api/broker/producer";
dotenv.config()

const PORT = process.env.PORT || 9002;

export const StartServer = async()=>{
    expressApp.listen(PORT, ()=>{
        console.log("App is listening to :", PORT)
    })

    process.on('uncaughtException', async(err)=>{
        console.log(err)
        process.exit(1)
    })
}

StartServer().then(()=>{
    console.log('server is up')
    connectDB()
    producer.connect();
})