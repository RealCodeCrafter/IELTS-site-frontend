import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeOutTime = duration - 300; // Start fading 300ms before closing
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, fadeOutTime);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]);

  const colors = {
    success: { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: '✅' },
    error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '❌' },
    info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', icon: 'ℹ️' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⚠️' },
  };

  const color = colors[type];

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        animation: isVisible ? 'slideIn 0.3s ease' : 'slideOut 0.3s ease',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <span style={{ fontSize: '20px' }}>{color.icon}</span>
      <div style={{ flex: 1, color: color.text, fontWeight: 600, fontSize: 14 }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: color.text,
          cursor: 'pointer',
          fontSize: '20px',
          padding: 0,
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
