import {IPictureRepository} from "../interfaces/PictureRepository.interface";
import {bucketName, minioClient} from "../database/minio/minio.client";
import path from "path";
import fs from "fs";

import {saveToLocalFileSystem} from "../utils";

export class PictureRepository implements IPictureRepository{
    async add(input: { key: string; file: Buffer }): Promise<Buffer> {
        // IF i can add minio service on my system

        // const uploadedToMinIO = await uploadToMinIO(input.key, input.file);
        // if (!uploadedToMinIO) {
        //     saveToLocalFileSystem(input.key, input.file);
        // }

        saveToLocalFileSystem(input.key, input.file);
        return input.file
    }

    async delete(key: string) {
        try {
            const filePath = path.resolve(__dirname, '..', "utils/images", key)

             fs.unlink(filePath,()=>{
                console.log(`Файл ${key} успешно удален.`);
            });

            const updatedStr = key.replace(/\.webp$/, '_s.webp');
            const filePathSmall = path.resolve(__dirname, '..', "utils/images", updatedStr)
            fs.unlink(filePathSmall,()=>{
                console.log(`Файл ${updatedStr} успешно удален.`);
            });
        } catch (error) {
            console.error(`Ошибка при удалении файла ${key}:`, error);
        }
    }

    async find(key: string): Promise<Buffer> {
        try {
            try {
                const stream = await minioClient.getObject(bucketName, key);
                return new Promise<Buffer>((resolve, reject) => {
                    const chunks: Buffer[] = [];
                    stream.on('data', chunk => chunks.push(chunk));
                    stream.on('end', () => resolve(Buffer.concat(chunks)));
                    stream.on('error', err => reject(err));
                });
            } catch (error) {
                const localPath = path.join(__dirname, "..",'utils/images', key);
                return fs.promises.readFile(localPath);
            }
        } catch (error) {
            const err = error as Error
            throw new Error(`Error retrieving picture: ${err.message}`);
        }
    }

}