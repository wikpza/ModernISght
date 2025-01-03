import { Link, useLocation } from 'react-router-dom';

const ProfilePanel = ({input = "My account"}:{input?:string}) => {
    const location = useLocation(); // Получаем объект с текущим местоположением
    const pathSegments = location.pathname.split('/'); // Разбиваем путь на части
    const lastSegment = pathSegments[pathSegments.length - 1]; // Берем последний сегмент пути

    return (
        <div className={'font-sm mb-6 mx-5'}>
            <Link to={'#'} className={'text-gray-500 hover:underline'}>
                {input}
            </Link>
            {' / '}
            {lastSegment || 'Addresses'} {/* Если последний сегмент пустой, отображаем "Addresses" */}
        </div>
    );
};

export default ProfilePanel;
