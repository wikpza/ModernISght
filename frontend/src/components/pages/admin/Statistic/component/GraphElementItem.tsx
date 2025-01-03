import { GraphType } from "../../../../../types/payments.type.ts";
import { TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Регистрируем необходимые компоненты для графика
ChartJS.register(ArcElement, Tooltip, Legend, Title);

type Props = {
    list: GraphType[];
    valueName: string;
};

const GraphElementItem = ({ list, valueName }: Props) => {
    // Данные для графика
    const chartData = {
        labels: list.map((item) => `${item.name}`), // Названия ролей
        datasets: [
            {
                label: "Доля пользователей",
                data: list.map((item) => item.count), // Количество пользователей
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",  // Цвет 1
                    "rgba(153, 102, 255, 0.6)", // Цвет 2
                    "rgba(255, 159, 64, 0.6)",  // Цвет 3
                    "rgba(54, 162, 235, 0.6)",  // Цвет 4
                    "rgba(255, 99, 132, 0.6)",  // Цвет 5
                    "rgba(255, 205, 86, 0.6)",  // Цвет 6
                    "rgba(231, 233, 237, 0.6)", // Цвет 7
                    "rgba(153, 255, 204, 0.6)", // Цвет 8
                    "rgba(255, 99, 71, 0.6)",   // Цвет 9
                    "rgba(106, 90, 205, 0.6)",  // Цвет 10
                    "rgba(34, 193, 195, 0.6)",  // Цвет 11
                    "rgba(253, 187, 45, 0.6)",  // Цвет 12
                    "rgba(30, 144, 255, 0.6)",  // Цвет 13
                    "rgba(255, 69, 0, 0.6)",    // Цвет 14
                    "rgba(144, 238, 144, 0.6)", // Цвет 15
                    "rgba(238, 130, 238, 0.6)", // Цвет 16
                    "rgba(250, 128, 114, 0.6)", // Цвет 17
                    "rgba(0, 255, 255, 0.6)",   // Цвет 18
                    "rgba(255, 105, 180, 0.6)", // Цвет 19
                    "rgba(255, 165, 0, 0.6)",   // Цвет 20
                    "rgba(135, 206, 250, 0.6)"  // Цвет 21
                ], // Цвета секторов
                borderColor: [
                    "rgba(75, 192, 192, 1)",  // Цвет обводки 1
                    "rgba(153, 102, 255, 1)", // Цвет обводки 2
                    "rgba(255, 159, 64, 1)",  // Цвет обводки 3
                    "rgba(54, 162, 235, 1)",  // Цвет обводки 4
                    "rgba(255, 99, 132, 1)",  // Цвет обводки 5
                    "rgba(255, 205, 86, 1)",  // Цвет обводки 6
                    "rgba(231, 233, 237, 1)", // Цвет обводки 7
                    "rgba(153, 255, 204, 1)", // Цвет обводки 8
                    "rgba(255, 99, 71, 1)",   // Цвет обводки 9
                    "rgba(106, 90, 205, 1)",  // Цвет обводки 10
                    "rgba(34, 193, 195, 1)",  // Цвет обводки 11
                    "rgba(253, 187, 45, 1)",  // Цвет обводки 12
                    "rgba(30, 144, 255, 1)",  // Цвет обводки 13
                    "rgba(255, 69, 0, 1)",    // Цвет обводки 14
                    "rgba(144, 238, 144, 1)", // Цвет обводки 15
                    "rgba(238, 130, 238, 1)", // Цвет обводки 16
                    "rgba(250, 128, 114, 1)", // Цвет обводки 17
                    "rgba(0, 255, 255, 1)",   // Цвет обводки 18
                    "rgba(255, 105, 180, 1)", // Цвет обводки 19
                    "rgba(255, 165, 0, 1)",   // Цвет обводки 20
                    "rgba(135, 206, 250, 1)"  // Цвет обводки 21
                ], // Цвета обводки
                borderWidth: 1,
            },
        ],


    };

    // Опции для графика
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: valueName,
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'doughnut'>) => {
                        const value = context.raw as number;
                        const percentage = (
                            (value / list.reduce((acc, item) => acc + item.count, 0)) *
                            100
                        ).toFixed(2);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-full max-w-[300px]">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default GraphElementItem;
