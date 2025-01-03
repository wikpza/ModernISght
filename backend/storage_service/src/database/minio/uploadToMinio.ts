import {bucketName, minioClient} from "./minio.client";

export const uploadToMinIO = async (fileName: string, buffer: Buffer): Promise<boolean> => {
    try {
        await minioClient.putObject(bucketName, fileName, buffer);
        console.log(`File uploaded to MinIO: ${fileName}`);
        return true;
    } catch (error) {
        console.error('Error uploading to MinIO:', error);
        return false;
    }
};
