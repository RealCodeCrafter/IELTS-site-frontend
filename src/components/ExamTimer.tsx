import { useEffect, useState } from 'react';

interface ExamTimerProps {
  duration: number; // minutes
  onTimeUp: () => void;
  isStarted: boolean;
}

export default function ExamTimer({ duration, onTimeUp, isStarted }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds

  useEffect(() => {
    if (!isStarted) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isStarted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 300; // 5 minutes

  return (
    <div
      style={{
        padding: '12px 20px',
        background: isWarning ? '#fee2e2' : '#e0f2fe',
        border: `2px solid ${isWarning ? '#ef4444' : '#0ea5e9'}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontWeight: 700,
        color: isWarning ? '#dc2626' : '#0369a1',
        fontSize: '18px',
      }}
    >
      <span>⏱️</span>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      {isWarning && <span style={{ fontSize: 14 }}>Vaqt tugayapti!</span>}
    </div>
  );
}

