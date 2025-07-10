import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>,
    document.body
  );
};

// Individual Toast Component
const Toast = ({ toast, removeToast }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  React.useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseStyles = "pointer-events-auto transform transition-all duration-300 ease-out max-w-sm w-full";
    const animationStyles = isVisible 
      ? "translate-x-0 opacity-100 scale-100" 
      : "translate-x-full opacity-0 scale-95";
    const leavingStyles = isLeaving 
      ? "translate-x-full opacity-0 scale-95" 
      : "";
    
    return `${baseStyles} ${animationStyles} ${leavingStyles}`;
  };

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-black',
          border: 'border-green-500',
          emoji: '✅',
        };
      case 'error':
        return {
          bg: 'bg-black',
          border: 'border-red-500',
          emoji: '❌',
        };
      case 'warning':
        return {
          bg: 'bg-black',
          border: 'border-yellow-400',
          emoji: '⚠️',
        };
      case 'info':
        return {
          bg: 'bg-black',
          border: 'border-blue-400',
          emoji: 'ℹ️',
        };
      default:
        return {
          bg: 'bg-black',
          border: 'border-gray-400',
          emoji: '🔔',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className={getToastStyles()}>
      <div className={`
        ${typeStyles.bg} 
        ${typeStyles.border}
        border rounded-xl shadow-2xl backdrop-blur-sm
        relative overflow-hidden group
      `}>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 toast-shimmer"></div>
        {/* Content */}
        <div className="relative p-4 flex items-start space-x-3">
          {/* Emoji */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            {typeStyles.emoji}
          </div>
          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm leading-relaxed">
              {toast.message}
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-white/30 toast-progress"
            style={{
              '--duration': `${toast.duration}ms`
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Export toast functions for direct use
export const toast = {
  success: (message, duration) => {
    // This will be replaced by the context when used within components
    console.warn('toast.success() called outside of ToastProvider. Use useToast() hook instead.');
  },
  error: (message, duration) => {
    console.warn('toast.error() called outside of ToastProvider. Use useToast() hook instead.');
  },
  warning: (message, duration) => {
    console.warn('toast.warning() called outside of ToastProvider. Use useToast() hook instead.');
  },
  info: (message, duration) => {
    console.warn('toast.info() called outside of ToastProvider. Use useToast() hook instead.');
  }
}; 