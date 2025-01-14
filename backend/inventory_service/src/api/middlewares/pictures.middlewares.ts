import multer from "multer";
import path from "node:path";
import {NextFunction, Request, Response} from "express";
import sharp from "sharp";


const storage = multer.memoryStorage();
const uploadImages = multer({
    storage: storage,
    limits: { fileSize: 150 * 1024 }, // Ограничение на размер файла 150KB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Проверка расширения
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Images Only!'));
        }
    }
}).array('images', 8); // Ожидаем до 8 файлов с полем 'photos'

export const uploadHandlers = (req: Request, res: Response, next: NextFunction) => {
    uploadImages(req, res, (err) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        next();
    });
}
export const checkSizeImage = async (files: Express.Multer.File[]) => {
    for (const file of files) {
        const image = sharp(file.buffer);

        // Check the format
        const metadata = await image.metadata();
        if (metadata.format !== 'webp') {
            throw new Error('Image must be in WebP format');
        }

        // Check the dimensions
        if (metadata.width !== 1000 || metadata.height !== 1000) {
            throw new Error('Image must be 1000x1000 pixels');
        }
    }
};