import React from 'react';
import './style.scss';

const Button = ({
  type = 'button',
  onClick,
  disabled = false,
  children,
  variant = 'secondary',
  outline = false,
  size = 'md', // Default size
  className,
}) => {
  const baseClass = `Button ${className}`;
  const variantClass = `Button--${variant}`;
  const outlineClass = outline ? `Button--outline--${variant}` : variantClass;
  const sizeClass = `Button--${size}`; // Add size class

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${outlineClass} ${sizeClass}`}
    >
      {children}
    </button>
  );
};

export default Button;
