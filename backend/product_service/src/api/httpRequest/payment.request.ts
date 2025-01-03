import dotenv from "dotenv";
import axios, { AxiosError } from 'axios';
import { GetInfoUser } from "../../models/user.model";
import {GetAddress} from "../../models/address.model";
import {GetCard} from "../../models/card.model";
dotenv.config();

const API_GATEWAY_PORT = process.env.API_GATEWAY_PORT;
const API_GATEWAY_HOST = process.env.API_GATEWAY_HOST;

export const fetchUser = async (userId: string, token: string): Promise<{ user: GetInfoUser; status: boolean }> => {
    try {
        // Отправка запроса с токеном авторизации
        const response = await axios.get(
            `http://localhost:9001/user/admin/user/${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Формируем заголовок Authorization с Bearer токеном
                }
            }
        );

        // Если все прошло успешно, возвращаем данные пользователя
        return { user: response.data.user, status: true };

    } catch (err) {
        // Логирование и обработка ошибок
        const error = err as AxiosError;

        // Логируем подробности ошибки
        if (error.response) {
            console.error(`Error response status: ${error.response.status}`);
            console.error(`Error response data: ${JSON.stringify(error.response.data)}`);
            console.error(`Error response headers: ${JSON.stringify(error.response.headers)}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }

        // Возвращаем пустого пользователя и статус false в случае ошибки
        return {
            user: {
                lastName: "",
                firstName: "",
                role: "",
                email: "",
            },
            status: false,
        };
    }
};

export const fetchAddress = async ( addressId:string, token: string): Promise<{ address: GetAddress; status: boolean }> => {
    try {
        // Отправка запроса с токеном авторизации
        const response = await axios.get(
            `http://localhost:9001/user/addresses/${addressId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Формируем заголовок Authorization с Bearer токеном
                }
            }
        );

        // Если все прошло успешно, возвращаем данные пользователя
        return { address: response.data, status: true };

    } catch (err) {
        // Логирование и обработка ошибок
        const error = err as AxiosError;

        // Логируем подробности ошибки
        if (error.response) {
            console.error(`Error response status: ${error.response.status}`);
            console.error(`Error response data: ${JSON.stringify(error.response.data)}`);
            console.error(`Error response headers: ${JSON.stringify(error.response.headers)}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }

        // Возвращаем пустого пользователя и статус false в случае ошибки
        return {
            address: {
                lastName: "",
                firstName: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                zipCode: "",
                phoneNumber: "",
                preferred:false

            },
            status: false,
        };
    }
};

export const fetchCard = async (cardId: string, token: string): Promise<{ card: GetCard; status: boolean }> => {
    try {
        // Отправка запроса с токеном авторизации
        const response = await axios.get(
            `http://localhost:9001/user/cards/cardInfo/${cardId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        return { card: response.data, status: true };

    } catch (err) {
        // Логирование и обработка ошибок
        const error = err as AxiosError;

        // Логируем подробности ошибки
        if (error.response) {
            console.error(`Error response status: ${error.response.status}`);
            console.error(`Error response data: ${JSON.stringify(error.response.data)}`);
            console.error(`Error response headers: ${JSON.stringify(error.response.headers)}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }

        // Возвращаем пустого пользователя и статус false в случае ошибки
        return {
            card: {
                cvv: "",
                expiryDate: "",
                number: "",
            },
            status: false,
        };
    }
};
