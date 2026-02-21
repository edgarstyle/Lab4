import React from 'react';

// Простые компоненты, стилизованные как Belle, совместимые с React 18

export const TextInput = ({ value, onUpdate, type = 'text', placeholder, required, style, ...props }) => {
  const handleUpdate = (e) => {
    if (onUpdate) {
      onUpdate(e.target.value);
    }
  };

  return (
    <input
      type={type}
      value={value || ''}
      onChange={handleUpdate}
      onInput={handleUpdate}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        outline: 'none',
        transition: 'border-color 0.2s',
        ...style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#2196F3';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#ddd';
      }}
      {...props}
    />
  );
};

export const Button = ({ children, onClick, type = 'button', disabled, style, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#fff',
        backgroundColor: disabled ? '#ccc' : '#2196F3',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = '#1976D2';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = '#2196F3';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export const Checkbox = ({ checked, onChange, label, ...props }) => {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginRight: '10px',
        userSelect: 'none'
      }}
    >
      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '8px',
          cursor: 'pointer'
        }}
        {...props}
      />
      <span style={{ fontSize: '14px' }}>{label}</span>
    </label>
  );
};

