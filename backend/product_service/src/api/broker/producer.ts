import {Kafka, Partitioners} from 'kafkajs';
import {checkSizeImage} from "../middlewares/pictures.middlewares";
import {NotFoundError} from "../../utils/error";

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: ['localhost:9092']
});


export const producer = kafka.producer({createPartitioner: Partitioners.LegacyPartitioner,}
);

export const producerCreateInventory = async (input: { sku: string, sizes: string[] }) => {
    if (!producer) throw new Error('Producer is not initialized');
    if (input.sizes.length === 0) throw new Error('Sizes cannot be empty');
    try {
        const sizesString = JSON.stringify(input.sizes);
        await producer.send({
            topic: "createProductInventory",
            messages: [
                {
                    key: input.sku,
                    value: sizesString
                }
            ]
        });
        console.log('Messages sent successfully');
    } catch (error) {
        console.error('Error sending messages:', error);
        throw new Error('Cannot create size type');
    }
};

export const producerDeleteInventory = async(sku:string)=>{
    if (!producer) throw new Error('Producer is not initialized');
   try{
       await producer.send({
           topic:'deleteProductInventory',
           messages:[{key:sku, value:""}]
       })
       console.log('Messages sent successfully');
   }catch(error){
       console.error('Error sending messages:', error);
       throw new Error('Cannot create size type');
   }
}
import sharp from 'sharp';



export const producerSentPictures = async ({ files, keys }: { files: Express.Multer.File[], keys: string[] }) => {
    await checkSizeImage(files);

    if (!producer) {
        throw new Error('Producer is not initialized');
    }
    if (keys.length !== files.length || files.length === 0 || keys.length === 0) {
        throw new Error('keys or files is empty');
    }

    const transformedArray = files.map((file, index) => {
        return {
            key: keys[index],
            value: file.buffer.toString('base64'),
        };
    });

    try {
        await producer.send({
            topic: 'productVariantPictures',
            messages: transformedArray,
        });

        console.log('Messages sent successfully');
    } catch (error) {
        console.error('Error sending messages:', error);
        throw new NotFoundError('Product added, but pictures not sent');
    }
};

export const producerDeletePictures = async (keys: string[]) => {
    try {
        if (!producer) {
            throw new Error('Producer is not initialized');
        }
        const messages = keys.map(key => ({
            value: key
        }));

        await producer.send({
            topic: 'deleteProductImages',
            messages: messages,
        });

        console.log('Messages to delete sent successfully');
    } catch (error) {
        console.error('Error sending messages:', error);
        throw new NotFoundError('Unable to delete pictures');
    }
};

