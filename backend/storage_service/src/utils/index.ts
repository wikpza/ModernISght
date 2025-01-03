import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const saveToLocalFileSystem = async (fileName: string, buffer: Buffer) => {
    try {
        const filePathLarge = path.join(__dirname, 'images', fileName); // для оригинального размера
        const filePathSmall = path.join(__dirname, 'images', fileName.replace('.webp', '_s.webp')); // для маленькой версии

        // Сохранение оригинальной версии (1000x1000)
        fs.mkdirSync(path.dirname(filePathLarge), { recursive: true });
        fs.writeFileSync(filePathLarge, buffer);
        console.log(`Large file saved locally: ${filePathLarge}`);

        // Создание и сохранение маленькой версии (300x300)
        await sharp(buffer)
            .resize(300, 300) // изменение размера до 300x300
            .webp() // сохраняем как webp
            .toFile(filePathSmall); // сохраняем файл

        console.log(`Small file saved locally: ${filePathSmall}`);

    } catch (error) {
        console.error('Error saving file locally:', error);
    }
};
