import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: 'localhost',       // Адрес MinIO сервера
    port: 9000,                  // Порт MinIO сервера
    useSSL: false,               // Используй true, если MinIO настроен на работу через HTTPS
    accessKey: 'your-access-key', // Укажи свой access key
    secretKey: 'your-secret-key'  // Укажи свой secret key
});

const bucketName = 'your-bucket-name'; // Название бакета MinIO

export { minioClient, bucketName };