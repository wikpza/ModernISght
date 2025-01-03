import React, { useState } from 'react';

// Интерфейс для типа опций
interface ComboBoxProps {
    options: { value: string; name: string }[]; // Массив объектов с полями value и name
    onChange: (selectedValue: { value: string; name: string }) => void; // Обработчик изменения
    label:string
}

const ComboBoxProductView: React.FC<ComboBoxProps> = ({ options, onChange, label }:ComboBoxProps) => {
    const [selectedValue, setSelectedValue] = useState<string>('');

    // Обработчик изменения выбранного значения
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const selectedOption = options.find(option => option.value === value);

        if (selectedOption) {
            setSelectedValue(value);
            onChange(selectedOption);  // Передаем объект с выбранной опцией
        }
    };

    return (
        <div className="combo-box flex items-center h-full  border border-gray-400 text-black font-bold  rounded text-sm px-2 w-[180px]">
            <label className={'font-normal'} htmlFor="comboBox">Sort by :</label>
            <select
                id="comboBox"
                value={selectedValue}
                onChange={handleChange}
                className="combo-box-select"
            >
                <option value="" disabled>
                    {label}
                </option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ComboBoxProductView;
