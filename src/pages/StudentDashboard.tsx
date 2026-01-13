import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import ProgressChart from '../components/ProgressChart';

type Exam = { id: string; title: string; type: string };
type Attempt = { id: string; exam: Exam; score?: { overall: number }; createdAt?: string };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    api.get('/exams').then((r) => setExams(r.data));
    if (user) {
      api.get(`/exams/user/${user.id}`).then((r) => setAttempts(r.data));
    }
  }, [user]);

  return (
    <div className="grid">
          <div className="card">
            <div className="section-title">📚 Imtihonlar</div>
            <p className="muted" style={{ marginTop: 0, marginBottom: 20 }}>
              O'zingizga mos imtihonni tanlab, mashq qiling va bilimingizni sinab ko'ring.
            </p>
            {exams.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', padding: '40px', fontSize: '15px' }}>
                Hozircha imtihonlar mavjud emas
              </div>
            ) : (
              <div className="grid two">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>{exam.title}</div>
                      <div style={{ fontSize: 13, color: '#64748b', textTransform: 'capitalize' }}>{exam.type}</div>
                    </div>
                    <Link className="btn secondary" to={`/exam/${exam.id}`} style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                      Boshlash →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <div className="section-title">📊 Mening natijalarim</div>
            {attempts.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <ProgressChart attempts={attempts} />
              </div>
            )}
            <p className="muted" style={{ marginTop: 0, marginBottom: 20 }}>
              Avval topshirgan imtihonlaringiz va umumiy ballar.
            </p>
            {attempts.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', padding: '40px', fontSize: '15px' }}>
                Hozircha natijalar mavjud emas. Birinchi imtihonni topshiring!
              </div>
            ) : (
              attempts.map((a) => (
                <div key={a.id} className="result-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>{a.exam?.title}</div>
                      {a.createdAt && (
                        <div style={{ fontSize: 13, color: '#64748b' }}>
                          {new Date(a.createdAt).toLocaleString('uz-UZ')}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Overall</div>
                        <div className="score-badge">{a.score?.overall ?? '—'}</div>
                      </div>
                      <Link to={`/attempt/${a.id}`} className="btn secondary" style={{ padding: '10px 20px' }}>
                        Batafsil
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

