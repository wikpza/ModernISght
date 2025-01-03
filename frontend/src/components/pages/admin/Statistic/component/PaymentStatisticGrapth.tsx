import { useGetPaymentStatic } from "../../../../../api/PaymentAPI.tsx";
import { useState } from "react";
import { Bar } from "react-chartjs-2"; // Изменяем Doughnut на Bar
import { Chart as ChartJS, BarElement, Tooltip, Legend, Title, TooltipItem, CategoryScale, LinearScale } from 'chart.js';
import SetParamsPanel from "./SetParamsPanel.tsx";
import {Card} from "../../../../ui/card.tsx";
import GraphElementItem from "./GraphElementItem.tsx";

// Регистрируем необходимые компоненты для графика
ChartJS.register(BarElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

export type PaymentStat = {
    shippingStatus: string;
    status: string;
    fromDate: Date;
    toDate: Date;
    category: { _id: string; name: string };
    collection: { _id: string; name: string };
    gender: { _id: string; name: string };
    brand: { _id: string; name: string };
};

const PaymentStatisticGraph = () => {
    const [params, setParams] = useState<PaymentStat>({
        shippingStatus: "self-pickup",
        status: "succeeded",
        fromDate: new Date(),
        toDate: new Date(),
        category: { name: "", _id: "" },
        collection: { name: "", _id: "" },
        gender: { name: "", _id: "" },
        brand: { name: "", _id: "" },
    });

    const { payments, isLoading, refetch } = useGetPaymentStatic(params);

    if (!payments || isLoading) {
        return <div>is loading</div>;
    }

    // Данные для графика
    const chartData = {
        labels: payments.data.map(item => `${item.name} ${item.color?.name ? item.color.name : ""}`), // Названия товаров
        datasets: [
            {
                label: 'Доля продаж',
                data: payments.data.map(item => item.totalQuantity), // Количество покупок
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ], // Цвета секторов
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ], // Цвета обводки
                borderWidth: 1,
            },
        ],
    };

    // Опции для горизонтальной гистограммы
    const options = {
        responsive: true,
        indexAxis: 'y' as const, // Здесь мы явно указываем тип 'y' для indexAxis
        plugins: {
            title: {
                display: true,
                text: `Total price spent for these params is $${payments.totalPrice}`,
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'bar'>) => {
                        const value = context.raw as number;
                        const percentage = ((value / payments.data.reduce((acc, item) => acc + item.totalQuantity, 0)) * 100).toFixed(2);
                        return `${context.label}: ${value} ( ${percentage}% )`;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true, // Ось X начинается с нуля
            },
            y: {
                ticks: {
                    autoSkip: false, // Для отображения всех меток
                },
            },
        },
    };

    return (
        <div>
            <div className={'flex flex-wrap w-full gap-2'}>
                <SetParamsPanel params={params} setParams={setParams} refetch={refetch} />
                <Card className="max-w-[600px] mb-10 cardShadow flex">
                    <GraphElementItem list={payments.collections} valueName={"Collections"}/>
                </Card>
                <Card className="max-w-[600px] mb-10 cardShadow flex">
                    <GraphElementItem list={payments.categories} valueName={"Categories"}/>
                </Card>
            </div>

            <Card className="mb-10">
                <Bar data={chartData} options={options} className=" h-full  w-full" />
            </Card>


            <Card className="w-fit mb-10 cardShadow flex space-x-5 py-5">
                <GraphElementItem list={payments.genders} valueName={"Genders"}/>
                <GraphElementItem list={payments.brands} valueName={"Brands"}/>
            </Card>

        </div>
    );
};

export default PaymentStatisticGraph;
