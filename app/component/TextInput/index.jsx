import React, { useState } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import './style.scss';
import Image from 'next/image';
import { Icon } from '@iconify/react';

const TextInput = ({
  label,
  name,
  type,
  placeholder,
  register,
  errors,
  rules,
  className,
  autocomplete,
  disabled,
  inputIcon,
  onInputChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`TextInput ${className ? className : ''}`}>
      {label && <label htmlFor={name}>{label} {rules?.required && <span className="text-red-500">*</span>}</label>}
      <div className="relative">
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autocomplete}
          {...register(name, rules)}
          disabled={disabled}
          className={`bg-slate-400 border focus:outline-none focus:border-gray-300  ${type === 'password' ? 'pr-14' : 'pr-2 '} amount-input`}
          onInput={(event) => {
            if (onInputChange) {
              onInputChange(event);
            }
          }}
        />
        {inputIcon && (
          <span className="inputIcon">
            <Image src={inputIcon} width={30} height={30} alt={name} />
          </span>
        )}
        {type === 'password' && (
          <span onClick={togglePasswordVisibility} className="passwordIcon">
            {showPassword ? (
              <Icon icon="charm:eye" width="24" height="24" />
            ) : (
              <Icon icon="charm:eye-slash" width="24" height="24" />
            )}
          </span>
        )}
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className='error-message'>{message}</p>
        )}
      />
      <checkbox/>
    </div>
  );
};

export default TextInput;

