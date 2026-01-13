import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { login, password });
      loginUser(res.data.accessToken, res.data.user);
      // Admin bo'lsa admin panelga, student bo'lsa dashboardga
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="pill" style={{ marginBottom: 10 }}>
          Kirish
        </div>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Xush kelibsiz</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 18 }}>
          IELTS platformasiga kirish uchun ma'lumotlarni kiriting.
        </p>
        <form onSubmit={handleSubmit} className="grid">
          <input
            className="input"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            className="input"
            placeholder="Parol"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div style={{ color: '#e11d48', fontWeight: 600 }}>{error}</div>}
          <button className="btn" type="submit">
            Kirish
          </button>
        </form>
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <span className="muted">Hisobingiz yo‘qmi? </span>
          <Link className="link" to="/register">
            Ro‘yxatdan o‘tish
          </Link>
        </div>
      </div>
    </div>
  );
}

