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
  const detailed = attempt.detailedResults || {};
  const sections = [
    { key: 'listening', icon: '🎧', label: 'Listening' },
    { key: 'reading', icon: '📖', label: 'Reading' },
    { key: 'writing', icon: '✍️', label: 'Writing' },
    { key: 'speaking', icon: '🗣️', label: 'Speaking' },
  ];

  return (
    <div className="grid">
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
          boxShadow: '0 12px 40px rgba(37, 99, 235, 0.4)',
          marginBottom: '32px'
        }}>
          <div style={{ opacity: 0.95, marginBottom: 8, fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>
            OVERALL SCORE
          </div>
          <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-1px' }}>{s.overall ?? '—'}</div>
        </div>

        {/* Detailed Results */}
        {detailed.listening && (
          <div style={{ marginBottom: '32px' }}>
            <div className="section-title" style={{ marginBottom: '16px' }}>🎧 Listening - Batafsil Natija</div>
            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#64748b' }}>
              To'g'ri javoblar: {detailed.listening.correct} / {detailed.listening.total} | Ball: {detailed.listening.score}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {detailed.listening.questions?.map((q: any, idx: number) => (
                <div key={idx} style={{ 
                  padding: '16px', 
                  background: q.isCorrect ? '#dcfce7' : '#fee2e2', 
                  borderRadius: '8px',
                  border: `2px solid ${q.isCorrect ? '#22c55e' : '#ef4444'}`
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '15px' }}>
                    {idx + 1}. {q.question}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Sizning javobingiz:</strong> {q.userAnswer}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>To'g'ri javob:</strong> {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' yoki ') : q.correctAnswer}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: q.isCorrect ? '#166534' : '#991b1b' }}>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detailed.reading && (
          <div style={{ marginBottom: '32px' }}>
            <div className="section-title" style={{ marginBottom: '16px' }}>📖 Reading - Batafsil Natija</div>
            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#64748b' }}>
              To'g'ri javoblar: {detailed.reading.correct} / {detailed.reading.total} | Ball: {detailed.reading.score}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {detailed.reading.questions?.map((q: any, idx: number) => (
                <div key={idx} style={{ 
                  padding: '16px', 
                  background: q.isCorrect ? '#dcfce7' : '#fee2e2', 
                  borderRadius: '8px',
                  border: `2px solid ${q.isCorrect ? '#22c55e' : '#ef4444'}`
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '15px' }}>
                    {idx + 1}. {q.question}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Sizning javobingiz:</strong> {q.userAnswer}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>To'g'ri javob:</strong> {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' yoki ') : q.correctAnswer}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: q.isCorrect ? '#166534' : '#991b1b' }}>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detailed.writing && (
          <div style={{ marginBottom: '32px' }}>
            <div className="section-title" style={{ marginBottom: '16px' }}>✍️ Writing - Batafsil Natija</div>
            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#64748b' }}>
              Umumiy ball: {detailed.writing.score}
            </div>
            {detailed.writing.task1 && (
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '16px' }}>Task 1</div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <strong>So'zlar soni:</strong> {detailed.writing.task1.wordCount} / {detailed.writing.task1.targetWords}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <strong>Ball:</strong> {detailed.writing.task1.score}
                </div>
                <div style={{ fontSize: '14px', color: '#334155' }}>
                  {detailed.writing.task1.feedback}
                </div>
              </div>
            )}
            {detailed.writing.task2 && (
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '16px' }}>Task 2</div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <strong>So'zlar soni:</strong> {detailed.writing.task2.wordCount} / {detailed.writing.task2.targetWords}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <strong>Ball:</strong> {detailed.writing.task2.score}
                </div>
                <div style={{ fontSize: '14px', color: '#334155' }}>
                  {detailed.writing.task2.feedback}
                </div>
              </div>
            )}
          </div>
        )}

        {detailed.speaking && (
          <div style={{ marginBottom: '32px' }}>
            <div className="section-title" style={{ marginBottom: '16px' }}>🗣️ Speaking - Batafsil Natija</div>
            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#64748b' }}>
              Umumiy ball: {detailed.speaking.score}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {detailed.speaking.parts?.map((part: any, idx: number) => (
                <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '16px' }}>Part {part.partNumber}</div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>So'zlar soni:</strong> {part.wordCount}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Ball:</strong> {part.score}
                  </div>
                  <div style={{ fontSize: '14px', color: '#334155' }}>
                    {part.feedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

