import React, { useState, useEffect } from 'react';

// Custom Toast System State Manager
const listeners = new Set();
let toastIdCounter = 0;
const emit = (toast) => {
  listeners.forEach((listener) => listener(toast));
};

export const toast = {
  success: (message) => {
    const id = toastIdCounter++;
    emit({ id, message, type: 'success' });
  },
  error: (message) => {
    const id = toastIdCounter++;
    emit({ id, message, type: 'error' });
  },
  info: (message) => {
    const id = toastIdCounter++;
    emit({ id, message, type: 'info' });
  }
};

// Toast Container Component
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };
    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '360px',
      width: '100%'
    }}>
      {toasts.map((t) => {
        let bgColor = '#111827';
        let borderColor = '#374151';
        let textColor = '#f3f4f6';
        let icon = '⚡';

        if (t.type === 'success') {
          bgColor = '#064e3b';
          borderColor = '#10b981';
          textColor = '#ecfdf5';
          icon = '🛡️';
        } else if (t.type === 'error') {
          bgColor = '#7f1d1d';
          borderColor = '#ef4444';
          textColor = '#fef2f2';
          icon = '⚠️';
        } else if (t.type === 'info') {
          bgColor = '#1e3a8a';
          borderColor = '#3b82f6';
          textColor = '#eff6ff';
          icon = 'ℹ️';
        }

        return (
          <div
            key={t.id}
            style={{
              padding: '16px',
              borderRadius: '6px',
              backgroundColor: bgColor,
              borderLeft: `5px solid ${borderColor}`,
              color: textColor,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
              fontFamily: 'monospace, system-ui, sans-serif',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              animation: 'slideIn 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{icon}</span>
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                opacity: 0.7,
                fontSize: '1.2rem',
                lineHeight: 1
              }}
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Button Component
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = {
    fontFamily: 'monospace, sans-serif',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: '1px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const variants = {
    primary: {
      backgroundColor: '#f59e0b',
      color: '#000000',
      borderColor: '#f59e0b',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      borderColor: '#4b5563',
    },
    danger: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      borderColor: '#dc2626',
    },
    neon: {
      backgroundColor: '#00ff66',
      color: '#000000',
      borderColor: '#00ff66',
    },
    dark: {
      backgroundColor: '#111827',
      color: '#ffffff',
      borderColor: '#374151',
    }
  };

  const sizes = {
    sm: {
      padding: '6px 12px',
      fontSize: '0.75rem',
    },
    md: {
      padding: '10px 20px',
      fontSize: '0.875rem',
    },
    lg: {
      padding: '14px 28px',
      fontSize: '1rem',
    }
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  const combinedStyle = {
    ...baseStyles,
    ...currentVariant,
    ...currentSize
  };

  return (
    <button
      style={combinedStyle}
      className={`ami-btn ${className}`}
      onMouseOver={(e) => {
        e.currentTarget.style.filter = 'brightness(1.1)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.filter = 'none';
        e.currentTarget.style.transform = 'none';
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Badge Component
export function Badge({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 8px',
    fontSize: '0.7rem',
    fontWeight: '700',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: 'monospace'
  };

  const variants = {
    default: {
      backgroundColor: '#374151',
      color: '#f3f4f6',
    },
    neon: {
      backgroundColor: '#00ff66',
      color: '#000000',
    },
    amber: {
      backgroundColor: '#f59e0b',
      color: '#000000',
    },
    danger: {
      backgroundColor: '#991b1b',
      color: '#fecaca',
    },
    carbon: {
      backgroundColor: '#111827',
      color: '#f59e0b',
      border: '1px solid #f59e0b',
    }
  };

  const style = {
    ...baseStyle,
    ...(variants[variant] || variants.default)
  };

  return (
    <span style={style} className={className} {...props}>
      {children}
    </span>
  );
}

// Custom UI Exporters Bundle for AMI App
export default {
  toast,
  ToastContainer,
  Button,
  Badge
};