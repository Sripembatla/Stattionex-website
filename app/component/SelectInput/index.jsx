import React from 'react';
import { ErrorMessage } from '@hookform/error-message';
import './style.scss';

const SelectInput = ({
  label,
  name,
  options,
  register,
  errors,
  rules,
  className,
  disabled,
}) => {
  return (
    <div className={`SelectInput ${className ? className : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        name={name}
        {...register(name, rules)}
        disabled={disabled}
        className="select"
      >
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export default SelectInput;
