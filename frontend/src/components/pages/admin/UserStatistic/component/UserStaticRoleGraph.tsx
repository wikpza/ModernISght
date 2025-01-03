
import { Doughnut } from "react-chartjs-2";
import { TooltipItem } from "chart.js";

// Компонент для отображения графика
type Props = {
    adminNumber:number,
    userNumber:number,
    employerNumber:number
}
const UserStaticRoleGraph = ({adminNumber, employerNumber, userNumber}:Props) => {

    const userList = [
        { name: "admin", count: adminNumber },
        { name: "user", count: userNumber },
        { name: "employer", count: employerNumber },
    ];

    // Данные для графика
    const chartData = {
        labels: userList.map((item) => `${item.name}`), // Названия ролей
        datasets: [
            {
                label: 'Доля пользователей',
                data: userList.map((item) => item.count), // Количество пользователей
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ], // Цвета секторов
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
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
                text: `Number of users and their role`,
            },
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'doughnut'>) => {
                        const value = context.raw as number;
                        const percentage = (
                            (value / userList.reduce((acc, item) => acc + item.count, 0)) *
                            100
                        ).toFixed(2);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
                // Устанавливаем стиль для текста в тултипе

            },
        },
    };

    return (
        <div className=" h-full w-fit">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default UserStaticRoleGraph;
