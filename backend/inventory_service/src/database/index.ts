import dotenv from "dotenv";
import mongoose from 'mongoose';




dotenv.config()
const MONGOOSE_DB_NAME  = process.env.MONGOOSE_DB_NAME
const MONGOOSE_DB_USER  = process.env.MONGOOSE_DB_USER
const MONGOOSE_DB_PASSWORD  = process.env.MONGOOSE_DB_PASSWORD
const MONGOOSE_DB_HOST  = process.env.MONGOOSE_DB_HOST
const MONGOOSE_DB_PORT  = process.env.MONGOOSE_DB_PORT


export const  connectDB = ()=> {
    if(!MONGOOSE_DB_NAME || !MONGOOSE_DB_USER || !MONGOOSE_DB_PASSWORD || !MONGOOSE_DB_PORT || !MONGOOSE_DB_HOST) throw new Error('not declared variables : MONGOOSE_DB_PASSWORD, MONGOOSE_DB_USER, MONGOOSE_DB_HOST, MONGOOSE_DB_PORT and MONGOOSE_DB_NAME')
    const url = `mongodb://${MONGOOSE_DB_USER}:${MONGOOSE_DB_PASSWORD}@${MONGOOSE_DB_HOST}:${MONGOOSE_DB_PORT}/${MONGOOSE_DB_NAME}`;
    mongoose.connect(url)
        .then(() => {
            console.log(`Database connected: ${url}`);
        })
        .catch(err => {
            console.error(`Connection error: ${err}`);
            process.exit(1);
        });

    // Обработка событий подключения
    const dbConnection = mongoose.connection;

    dbConnection.on('error', (err) => {
        console.error(`Database connection error: ${err}`);
    });

    dbConnection.once('open', () => {
        console.log(`Database connection established: ${url}`);
    });
}
