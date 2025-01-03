import express, { NextFunction, Request, Response } from 'express';
import { PictureService } from '../services/picture.service';
import { PictureRepository } from '../repositories/picture.repository';

const router = express.Router();
export const pictureService = new PictureService(new PictureRepository());

router.get('/:key', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = req.params.key;

        // Получаем изображение как Buffer
        const data = await pictureService.getPicture(key);

        // Устанавливаем правильный Content-Type для webp (или другой тип, если нужно)
        res.setHeader('Content-Type', 'image/webp');

        // Отправляем изображение как бинарные данные
        res.status(200).send(data);
        res.end()
    } catch (error) {
        const err = error as Error;
        return res.status(500).json({ message: err.message });
    }
});


export default router;
