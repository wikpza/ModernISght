import {consumer} from "./kafka.client";
import {pictureService} from "../picture.routes";


export const startConsumers = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'productVariantPictures', fromBeginning: true });
    await consumer.subscribe({ topic: 'deleteProductImages', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                if (topic === 'productVariantPictures') {
                    if(message.value){
                        const base64Data = message.value.toString();
                        const buffer = Buffer.from(base64Data, 'base64');
                        const fileName = `${message.key}`;
                        await pictureService.addPicture({file:buffer, key:fileName})
                    }
                } else if (topic === 'deleteProductImages') {
                    if(message.value){
                        const fileName = `${message.value}`;
                        console.log('deleting file ', fileName)
                        await pictureService.deletePicture(fileName)
                    }
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        },
    });
};