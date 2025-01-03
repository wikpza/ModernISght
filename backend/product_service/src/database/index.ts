import mongoose from 'mongoose';

export default function connectDB() {
    const url = `mongodb://localhost:27018/products`;
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
