import {TooltipItem} from "chart.js";
import {Doughnut} from "react-chartjs-2";

type Props = {
    userNumber:number,
    unVerifyUser:number
}

const UserUnverifyStatic = ({userNumber, unVerifyUser}:Props) => {

    const userList = [
        { name: "Verify email user", count: userNumber },
        { name: "not verify email user", count: unVerifyUser },
    ];

    // Данные для графика
    const chartData = {
        labels: userList.map((item) => `${item.name}`), // Названия ролей
        datasets: [
            {
                label: 'Доля пользователей',
                data: userList.map((item) => item.count), // Количество пользователей
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ], // Цвета секторов
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
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
                text: `Number of verify email users and not verify email users`,
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
        <div className="w-full h-full">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default UserUnverifyStatic;