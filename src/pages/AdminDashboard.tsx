import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'exams' | 'attempts'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [examForm, setExamForm] = useState({
    title: '',
    type: 'full',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'exams') {
        const res = await api.get('/admin/exams');
        setExams(res.data);
      } else if (activeTab === 'attempts') {
        const res = await api.get('/admin/attempts');
        setAttempts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Foydalanuvchini o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadData();
    } catch (err) {
      alert('Xatolik yuz berdi');
    }
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Imtihonni o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/admin/exams/${id}`);
      loadData();
    } catch (err) {
      alert('Xatolik yuz berdi');
    }
  };

  const createExam = async () => {
    if (!examForm.title || !examForm.type) {
      alert('Sarlavha va turini kiriting');
      return;
    }
    try {
      await api.post('/admin/exams', {
        title: examForm.title,
        type: examForm.type,
        content: {
          description: examForm.description || 'IELTS practice',
        },
      });
      setExamForm({ title: '', type: 'full', description: '' });
      loadData();
    } catch (err) {
      alert('Imtihon yaratishda xatolik');
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            className={activeTab === 'stats' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('stats')}
            style={{ color: activeTab === 'stats' ? 'white' : '#0f172a' }}
          >
            📊 Statistika
          </button>
          <button
            className={activeTab === 'users' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('users')}
            style={{ color: activeTab === 'users' ? 'white' : '#0f172a' }}
          >
            👥 Foydalanuvchilar
          </button>
          <button
            className={activeTab === 'exams' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('exams')}
            style={{ color: activeTab === 'exams' ? 'white' : '#0f172a' }}
          >
            📚 Imtihonlar
          </button>
          <button
            className={activeTab === 'attempts' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('attempts')}
            style={{ color: activeTab === 'attempts' ? 'white' : '#0f172a' }}
          >
            📝 Urinishlar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          Yuklanmoqda...
        </div>
      ) : (
        <>
          {activeTab === 'stats' && stats && (
            <div className="grid two">
              <div className="stat">
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb', marginBottom: 8 }}>
                  {stats.totalUsers}
                </div>
                <div className="muted">Jami foydalanuvchilar</div>
              </div>
              <div className="stat">
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb', marginBottom: 8 }}>
                  {stats.totalStudents}
                </div>
                <div className="muted">Talabalar</div>
              </div>
              <div className="stat">
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb', marginBottom: 8 }}>
                  {stats.totalExams}
                </div>
                <div className="muted">Jami imtihonlar</div>
              </div>
              <div className="stat">
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb', marginBottom: 8 }}>
                  {stats.totalAttempts}
                </div>
                <div className="muted">Jami urinishlar</div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <div className="section-title">Foydalanuvchilar ({users.length})</div>
              {users.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  Foydalanuvchilar mavjud emas
                </div>
              ) : (
                <div className="grid">
                  {users.map((u) => (
                    <div key={u.id} className="result-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>
                            {u.login} {u.role === 'admin' && <span className="pill">Admin</span>}
                          </div>
                          <div className="muted" style={{ fontSize: 13 }}>
                            {u.profile?.firstName} {u.profile?.lastName}
                          </div>
                          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                            Urinishlar: {u.attempts?.length || 0}
                          </div>
                        </div>
                        {u.role !== 'admin' && (
                          <button 
                            className="btn ghost" 
                            onClick={() => deleteUser(u.id)} 
                            style={{ 
                              color: '#e11d48',
                              borderColor: '#e11d48'
                            }}
                          >
                            O'chirish
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div className="section-title">Imtihonlar ({exams.length})</div>
                <button className="btn secondary" onClick={() => navigate('/admin/exams/create')}>
                  + Yangi imtihon
                </button>
              </div>
              <div className="grid" style={{ marginBottom: 16 }}>
                <input
                  className="input"
                  placeholder="Sarlavha"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                />
                <div className="grid two">
                  <select
                    className="input"
                    value={examForm.type}
                    onChange={(e) => setExamForm({ ...examForm, type: e.target.value })}
                  >
                    <option value="full">Full</option>
                    <option value="listening">Listening</option>
                    <option value="reading">Reading</option>
                    <option value="writing">Writing</option>
                    <option value="speaking">Speaking</option>
                  </select>
                  <button className="btn secondary" type="button" onClick={createExam}>
                    Imtihon yaratish
                  </button>
                </div>
                <textarea
                  className="input"
                  placeholder="Tavsif / qo'shimcha ma'lumot"
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                />
              </div>
              {exams.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  Imtihonlar mavjud emas
                </div>
              ) : (
                <div className="grid">
                  {exams.map((e) => (
                    <div key={e.id} className="result-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 4 }}>{e.title}</div>
                          <div className="muted" style={{ fontSize: 13, textTransform: 'capitalize' }}>
                            {e.type}
                          </div>
                          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                            Urinishlar: {e.attempts?.length || 0}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            className="btn ghost" 
                            onClick={() => navigate(`/admin/exams/${e.id}/edit`)}
                            style={{ 
                              color: '#2563eb', 
                              borderColor: '#2563eb',
                              fontSize: 13 
                            }}
                          >
                            Tahrirlash
                          </button>
                          <button 
                            className="btn ghost" 
                            onClick={() => deleteExam(e.id)} 
                            style={{ 
                              color: '#e11d48', 
                              borderColor: '#e11d48',
                              fontSize: 13 
                            }}
                          >
                            O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attempts' && (
            <div className="card">
              <div className="section-title">Urinishlar ({attempts.length})</div>
              {attempts.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  Urinishlar mavjud emas
                </div>
              ) : (
                <div className="grid">
                  {attempts.map((a) => (
                    <div key={a.id} className="result-card">
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 20 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: 6 }}>{a.user?.login}</div>
                          <div style={{ color: '#475569', fontSize: 14, marginBottom: 4 }}>{a.exam?.title}</div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>
                            {new Date(a.createdAt).toLocaleString('uz-UZ')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="score-badge" style={{ width: '70px', height: '70px', fontSize: '28px' }}>
                            {a.score?.overall ?? '—'}
                          </div>
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 2 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="muted">Listening:</span>
                            <strong style={{ color: '#2563eb' }}>{a.score?.listening ?? '—'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="muted">Reading:</span>
                            <strong style={{ color: '#2563eb' }}>{a.score?.reading ?? '—'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="muted">Writing:</span>
                            <strong style={{ color: '#2563eb' }}>{a.score?.writing ?? '—'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="muted">Speaking:</span>
                            <strong style={{ color: '#2563eb' }}>{a.score?.speaking ?? '—'}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
