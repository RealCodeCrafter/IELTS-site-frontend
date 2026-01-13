import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function AttemptResult() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/exams/attempt/${id}`).then((r) => setAttempt(r.data));
  }, [id]);

  if (!attempt) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Natija yuklanmoqda...
        </div>
      </div>
    );
  }

  const s = attempt.score ?? {};
  const sections = [
    { key: 'listening', icon: '🎧', label: 'Listening' },
    { key: 'reading', icon: '📖', label: 'Reading' },
    { key: 'writing', icon: '✍️', label: 'Writing' },
    { key: 'speaking', icon: '🗣️', label: 'Speaking' },
  ];

  return (
    <div className="card">
      <div className="section-title">{attempt.exam?.title}</div>
      <div style={{ marginBottom: '24px', color: '#64748b', fontSize: '14px' }}>
        {attempt.createdAt ? new Date(attempt.createdAt).toLocaleString('uz-UZ') : ''}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {sections.map(({ key, icon, label }) => (
          <div key={key} className="stat">
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
            <div className="muted" style={{ textTransform: 'capitalize', fontSize: 13, marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb' }}>{(s as any)[key] ?? '—'}</div>
          </div>
        ))}
      </div>
      <div style={{ 
        padding: '32px', 
        background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', 
        borderRadius: '16px', 
        textAlign: 'center', 
        color: 'white',
        boxShadow: '0 12px 40px rgba(37, 99, 235, 0.4)'
      }}>
        <div style={{ opacity: 0.95, marginBottom: 8, fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>
          OVERALL SCORE
        </div>
        <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-1px' }}>{s.overall ?? '—'}</div>
      </div>
    </div>
  );
}

