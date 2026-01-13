import { useState } from 'react';

interface QuestionNavProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onNavigate: (index: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onNavigate,
}: QuestionNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxHeight: '80vh',
        overflowY: 'auto',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Savollar</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>
      {isOpen && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 8,
          }}
        >
          {Array.from({ length: totalQuestions }, (_, i) => {
            const questionNum = i + 1;
            const isAnswered = answeredQuestions.has(questionNum);
            const isCurrent = currentQuestion === questionNum;

            return (
              <button
                key={i}
                onClick={() => onNavigate(questionNum)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: isCurrent ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  background: isAnswered ? '#10b981' : isCurrent ? '#dbeafe' : 'white',
                  color: isCurrent ? '#2563eb' : isAnswered ? 'white' : '#64748b',
                  fontWeight: isCurrent ? 700 : 600,
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) e.currentTarget.style.background = isAnswered ? '#10b981' : 'white';
                }}
              >
                {questionNum}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}




