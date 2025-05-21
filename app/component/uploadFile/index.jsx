import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import './style.scss';

const UploadFile = ({ label, onChange, errors, name, register, rules, id, className, multiple }) => {
  return (
    <div className={`UploadFile ${className || ''}`}>
      {label && (
        <label className="block mb-2" htmlFor={id}>{label}</label>
      )}
      <input
        id={id}
        type="file"
        {...register(name, rules)}
        onChange={onChange}
        multiple={multiple}
      />
      <div>
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ messages }) => 
            messages ? Object.entries(messages).map(([type, message]) => (
              <p key={type} className='text-red-500 mt-1'>{message}</p>
            )) : null
          }
        />
      </div>
    </div>
  );
};

export default UploadFile;
