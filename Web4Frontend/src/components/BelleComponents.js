import React from 'react';

export const TextInput = ({ value, onChange, type = 'text', placeholder, ...props }) => {
  const handleUpdate = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleUpdate}
      onInput={handleUpdate}
      placeholder={placeholder}
      className="belle-text-input"
      {...props}
    />
  );
};

export const Button = ({ children, onClick, type = 'button', primary, className, style, ...props }) => {
  const buttonClass = `belle-button ${primary ? 'belle-button-primary' : ''} ${className || ''}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClass}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

