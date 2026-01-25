import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import ProgressChart from '../components/ProgressChart';
import { paymentsApi } from '../api/payments';
import Toast from '../components/Toast';
import InsufficientBalanceCard from '../components/InsufficientBalanceCard';

type Exam = { id: string; title: string; type: string };
type Attempt = { id: string; exam: Exam; score?: { overall: number }; createdAt?: string };

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    api.get('/exams').then((r) => setExams(r.data));
    if (user) {
      api.get(`/exams/user/${user.id}`).then((r) => setAttempts(r.data));
      loadBalance();
    }
  }, [user]);

  const loadBalance = async () => {
    try {
      const info = await paymentsApi.getUserAccess();
      setBalance(Number(info.balance) || 0);
    } catch (err) {
      console.error('Error loading balance:', err);
      setBalance(0);
    }
  };

  const handleStartExam = async (examId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Check balance - reload balance first
      await loadBalance();
      const { balance: currentBalance, hasEnough } = await paymentsApi.checkBalance();
      setBalance(Number(currentBalance) || 0);
      
      if (!hasEnough) {
        // Show toast and update balance display
        setToast({
          message: `Insufficient balance. You need 10,000 UZS to take an exam. Your current balance: ${(Number(currentBalance) || 0).toLocaleString('en-US')} UZS.`,
          type: 'warning',
        });
        return;
      }

      // Navigate to exam - backend will handle balance deduction
      navigate(`/exam/${examId}`);
    } catch (err: any) {
      console.error('Balance check error:', err);
      setToast({
        message: 'Error checking balance. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="grid">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      {balance < 10000 && (
        <InsufficientBalanceCard currentBalance={balance} />
      )}
          <div className="card">
            <div className="section-title">📚 Exams</div>
            <p className="muted" style={{ marginTop: 0, marginBottom: 20 }}>
              Choose an exam that suits you, practice and test your knowledge.
            </p>
            {exams.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', padding: '40px', fontSize: '15px' }}>
                No exams available yet
              </div>
            ) : (
              <div className="grid two">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>{exam.title}</div>
                      <div style={{ fontSize: 13, color: '#64748b', textTransform: 'capitalize' }}>{exam.type}</div>
                    </div>
                    <button
                      className="btn secondary"
                      onClick={() => handleStartExam(exam.id)}
                      style={{ width: '100%', textAlign: 'center', display: 'block' }}
                    >
                      Start →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <div className="section-title">📊 My Results</div>
            {attempts.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <ProgressChart attempts={attempts} />
              </div>
            )}
            <p className="muted" style={{ marginTop: 0, marginBottom: 20 }}>
              Your previous exam attempts and overall scores.
            </p>
            {attempts.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', padding: '40px', fontSize: '15px' }}>
                No results available yet. Take your first exam!
              </div>
            ) : (
              attempts.map((a) => (
                <div key={a.id} className="result-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>{a.exam?.title}</div>
                      {a.createdAt && (
                        <div style={{ fontSize: 13, color: '#64748b' }}>
                          {new Date(a.createdAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Overall</div>
                        <div className="score-badge">{a.score?.overall ?? '—'}</div>
                      </div>
                      <Link to={`/attempt/${a.id}`} className="btn secondary" style={{ padding: '10px 20px' }}>
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
  );
}

