import React, { useEffect } from 'react';
import gsap from 'gsap';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    gsap.fromTo(
      '.toast-container',
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    const timeout = setTimeout(() => {
      gsap.to('.toast-container', {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: onClose,
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-message">
        {type === 'success' && '✅ '}
        {type === 'error' && '❕'}
        {type === 'warning' && '⚠️ '}
        {type === 'info' && 'ℹ️ '}
        {message}
      </div>
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          color: #fff;
          z-index: 9999;
        }
        .toast-message {
          display: flex;
          align-items: center;
        }
        .success {
          background-color: #28a745;
        }
        .error {
          background-color: #dc3545;
        }
        .warning {
          background-color: #FFB300;
          color: #fff;
        }
        .info {
          background-color: #17a2b8;
        }
      `}</style>
    </div>
  );
};

export default Toast;
