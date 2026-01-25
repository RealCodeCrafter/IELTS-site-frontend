import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'exams' | 'attempts' | 'payments'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStartDate, setPaymentStartDate] = useState<string>('');
  const [paymentEndDate, setPaymentEndDate] = useState<string>('');
  const [examForm, setExamForm] = useState({
    title: '',
    type: 'full',
    description: '',
  });
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

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
      } else if (activeTab === 'payments') {
        const params = new URLSearchParams();
        if (paymentStartDate) params.append('startDate', paymentStartDate);
        if (paymentEndDate) params.append('endDate', paymentEndDate);
        const res = await api.get(`/admin/payments?${params.toString()}`);
        setPayments(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadData();
    } catch (err) {
      alert('An error occurred');
    }
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await api.delete(`/admin/exams/${id}`);
      loadData();
    } catch (err) {
      alert('An error occurred');
    }
  };

  const createExam = async () => {
    if (!examForm.title || !examForm.type) {
      alert('Please enter title and type');
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
      alert('Error creating exam');
    }
  };

  // Listen for admin tab change events from NavBar
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      const tab = event.detail as 'stats' | 'users' | 'exams' | 'attempts' | 'payments';
      setActiveTab(tab);
    };
    
    window.addEventListener('admin-tab-change', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('admin-tab-change', handleTabChange as EventListener);
    };
  }, []);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            className={activeTab === 'stats' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('stats')}
            style={{ color: activeTab === 'stats' ? 'white' : '#0f172a' }}
          >
            📊 Statistics
          </button>
          <button
            className={activeTab === 'users' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('users')}
            style={{ color: activeTab === 'users' ? 'white' : '#0f172a' }}
          >
            👥 Users
          </button>
          <button
            className={activeTab === 'exams' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('exams')}
            style={{ color: activeTab === 'exams' ? 'white' : '#0f172a' }}
          >
            📚 Exams
          </button>
          <button
            className={activeTab === 'attempts' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('attempts')}
            style={{ color: activeTab === 'attempts' ? 'white' : '#0f172a' }}
          >
            📝 Attempts
          </button>
          <button
            className={activeTab === 'payments' ? 'btn' : 'btn ghost'}
            onClick={() => setActiveTab('payments')}
            style={{ color: activeTab === 'payments' ? 'white' : '#0f172a' }}
          >
            💰 Payments
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          Loading...
        </div>
      ) : (
        <>
          {activeTab === 'stats' && stats && (
            <>
              <div className="grid four" style={{ marginBottom: 24 }}>
                <div className="card" style={{
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.1))',
                  border: '1px solid rgba(37, 99, 235, 0.2)'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#2563eb', marginBottom: 8 }}>
                    {stats.totalUsers}
                  </div>
                  <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Total Users</div>
                </div>
                <div className="card" style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#10b981', marginBottom: 8 }}>
                    {stats.totalStudents}
                  </div>
                  <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Students</div>
                </div>
                <div className="card" style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#8b5cf6', marginBottom: 8 }}>
                    {stats.totalExams}
                  </div>
                  <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Total Exams</div>
                </div>
                <div className="card" style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#f59e0b', marginBottom: 8 }}>
                    {stats.totalAttempts}
                  </div>
                  <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Total Attempts</div>
                </div>
              </div>
              
              {/* Additional Stats */}
              <div className="card" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div className="section-title" style={{ marginBottom: 20 }}>📈 Platform Overview</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>Active Users</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{stats.totalUsers - 1}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>Completion Rate</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                      {stats.totalAttempts > 0 ? ((stats.totalAttempts / stats.totalStudents) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4 }}>Avg Attempts/User</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                      {stats.totalStudents > 0 ? (stats.totalAttempts / stats.totalStudents).toFixed(1) : 0}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <div className="section-title">Users ({users.length})</div>
              {users.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No users available
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
                            Attempts: {u.attempts?.length || 0}
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
                            Delete
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
                <div className="section-title">Exams ({exams.length})</div>
                <button className="btn secondary" onClick={() => navigate('/admin/exams/create')}>
                  + New Exam
                </button>
              </div>
              <div className="grid" style={{ marginBottom: 16 }}>
                <input
                  className="input"
                  placeholder="Title"
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
                    Create Exam
                  </button>
                </div>
                <textarea
                  className="input"
                  placeholder="Description / additional information"
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                />
              </div>
              {exams.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No exams available
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
                            Attempts: {e.attempts?.length || 0}
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
                            Edit
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
                            Delete
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
              <div className="section-title">Attempts ({attempts.length})</div>
              {attempts.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No attempts available
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
                            {new Date(a.createdAt).toLocaleString('en-US')}
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

          {activeTab === 'payments' && (
            <div className="card">
              <div className="section-title">Payments ({payments.length})</div>
              
              {/* Date Filter */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                  type="date"
                  className="input"
                  value={paymentStartDate}
                  onChange={(e) => setPaymentStartDate(e.target.value)}
                  placeholder="Start Date"
                  style={{ flex: 1, minWidth: '150px' }}
                />
                <input
                  type="date"
                  className="input"
                  value={paymentEndDate}
                  onChange={(e) => setPaymentEndDate(e.target.value)}
                  placeholder="End Date"
                  style={{ flex: 1, minWidth: '150px' }}
                />
                <button
                  className="btn"
                  onClick={loadData}
                  style={{ minWidth: '100px' }}
                >
                  Filter
                </button>
                {(paymentStartDate || paymentEndDate) && (
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setPaymentStartDate('');
                      setPaymentEndDate('');
                      loadData();
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {payments.length === 0 ? (
                <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No payments available
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>
                          {payment.amount.toLocaleString('en-US')} {payment.currency}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>
                          User: {payment.userLogin || payment.userId}
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>
                          {new Date(payment.createdAt).toLocaleString('en-US')}
                        </div>
                        {payment.screenshotUrl && (
                          <div style={{ marginTop: 8 }}>
                            <button
                              type="button"
                              onClick={() => {
                                // Format screenshot URL correctly
                                let screenshotUrl = payment.screenshotUrl;
                                if (!screenshotUrl.startsWith('http')) {
                                  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
                                  screenshotUrl = screenshotUrl.startsWith('/') 
                                    ? `${baseUrl}${screenshotUrl}`
                                    : `${baseUrl}/${screenshotUrl}`;
                                }
                                setSelectedScreenshot(screenshotUrl);
                              }}
                              style={{
                                color: '#2563eb',
                                textDecoration: 'underline',
                                fontSize: 12,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              📷 View Screenshot
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: 12,
                          fontWeight: 600,
                          background: payment.status === 'paid' ? '#dcfce7' : payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: payment.status === 'paid' ? '#166534' : payment.status === 'pending' ? '#92400e' : '#991b1b',
                        }}>
                          {payment.status.toUpperCase()}
                        </div>
                        {payment.status === 'pending' && (
                          <>
                            <button
                              className="btn"
                              onClick={async () => {
                                try {
                                  await api.put(`/admin/payments/${payment.id}/approve`);
                                  loadData();
                                } catch (err) {
                                  alert('Error approving payment');
                                }
                              }}
                              style={{ fontSize: 12, padding: '6px 12px' }}
                            >
                              Approve
                            </button>
                            <button
                              className="btn ghost"
                              onClick={async () => {
                                if (!confirm('Are you sure you want to reject this payment?')) return;
                                try {
                                  await api.put(`/admin/payments/${payment.id}/reject`);
                                  loadData();
                                } catch (err) {
                                  alert('Error rejecting payment');
                                }
                              }}
                              style={{ fontSize: 12, padding: '6px 12px', color: '#e11d48', borderColor: '#e11d48' }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
          }}
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedScreenshot(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
            <img
              src={selectedScreenshot}
              alt="Payment Screenshot"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not found</text></svg>';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
