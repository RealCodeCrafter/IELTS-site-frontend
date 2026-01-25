import { useNavigate } from 'react-router-dom';

interface InsufficientBalanceCardProps {
  currentBalance: number;
  requiredAmount?: number;
}

export default function InsufficientBalanceCard({ currentBalance, requiredAmount = 10000 }: InsufficientBalanceCardProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
        border: '2px solid #f59e0b',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div style={{ fontSize: '32px' }}>💰</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: 8, color: '#92400e' }}>
          Insufficient Balance
        </div>
        <div style={{ fontSize: '14px', color: '#78350f', marginBottom: 12, lineHeight: 1.6 }}>
          Your current balance is <strong>{currentBalance.toLocaleString('en-US')} UZS</strong>, but you need{' '}
          <strong>{requiredAmount.toLocaleString('en-US')} UZS</strong> to take an exam. Please top up your balance first.
        </div>
        <button
          onClick={() => navigate('/payment')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
          }}
        >
          Top Up Balance →
        </button>
      </div>
    </div>
  );
}
