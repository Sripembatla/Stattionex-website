import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import './style.scss'
const Checkbox = ({ label, name, register, errors, rules, id, className }) => {
  return (
    <div className={`Checkbox ${className ? className : ''}`}>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={id}
          {...register(name, rules)}
          className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded-lg focus:ring-primary focus:ring-2"
        />
        {label && (
          <label htmlFor={id} className="text-black font-Poppins">
            {label}
          </label>
        )}
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className='error-message'>{message}</p>
        )}
      />
    </div>
  );
};

export default Checkbox;
