import dotenv from 'dotenv'
import expressApp from "./expressApp";
import { startConsumers} from "./api/kafka/consumerProductService";
import {consumer} from "./api/kafka/kafka.client";

dotenv.config()

const PORT = process.env.PORT || 9003;

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
    consumer.connect();
    startConsumers().catch(console.error);
})