const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Создаем экземпляр Express приложения
const app = express();

// Настройка middleware
app.use(cors()); // Включить CORS
app.use(helmet()); // Добавить заголовки безопасности
app.use(morgan("combined")); // Логирование HTTP запросов
app.disable("x-powered-by"); // Скрыть информацию о сервере Express

// Определяем маршруты и соответствующие микросервисы
const services = [
    {
        route: "/user",
        target: "http://localhost:9001/user",
    },
    {
        route: "/product",
        target: "http://localhost:9002/",
    },
    {
        route: "/storage",
        target: "http://localhost:9003/",
    },
    {
        route: "/inventory",
        target: "http://localhost:9004/inventory/",
    },
    {
        route: "/payment",
        target: "http://localhost:9005/payment/",
    },
];

// Настроим прокси для каждого микросервиса
services.forEach(({ route, target }) => {
    // Опции для прокси
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            [`^${route}`]: "", // Убираем префикс маршрута
        },
        onProxyReq: (proxyReq, req, res) => {
            // Убедитесь, что запросы с изображениями проксируются правильно
            if (req.url.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
                proxyReq.setHeader('Accept', 'image/webp, image/*');  // Установить заголовок Accept для изображений
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            // Устанавливаем правильный Content-Type для изображений
            if (req.url.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
                res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/webp');
            }
        }
    };

    // Применяем прокси для маршрутов
    app.use(route, createProxyMiddleware(proxyOptions));
});

// Обработчик маршрута "не найдено"
app.use((_req, res) => {
    res.status(404).json({
        code: 404,
        status: "Error",
        message: "Route not found.",
        data: null,
    });
});

// Устанавливаем порт для сервера Express
const PORT = process.env.PORT || 9000;

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});
