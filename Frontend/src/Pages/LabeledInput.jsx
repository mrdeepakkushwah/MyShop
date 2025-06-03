import React from 'react';

const LabeledInput = ({ label, name, value, onChange, placeholder, type = 'text', hint }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
    );
};

export default LabeledInput;
