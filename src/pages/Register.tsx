import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    login: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Ro‘yxatdan o‘tishda xatolik');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="pill" style={{ marginBottom: 10 }}>
          Ro‘yxatdan o‘tish
        </div>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Hisob yarating</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 18 }}>
          IELTS platformasidan foydalanish uchun ma'lumotlaringizni kiriting.
        </p>
        <form onSubmit={handleSubmit} className="grid">
          <input className="input" placeholder="Login" onChange={(e) => update('login', e.target.value)} />
          <input
            className="input"
            placeholder="Parol (min 6 belg)"
            type="password"
            onChange={(e) => update('password', e.target.value)}
          />
          <div className="grid two">
            <input className="input" placeholder="Ism" onChange={(e) => update('firstName', e.target.value)} />
            <input className="input" placeholder="Familiya" onChange={(e) => update('lastName', e.target.value)} />
          </div>
          {error && <div style={{ color: '#e11d48', fontWeight: 600 }}>{error}</div>}
          <button className="btn" type="submit">
            Davom etish
          </button>
        </form>
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <span className="muted">Hisobingiz bormi? </span>
          <Link className="link" to="/login">
            Kirish
          </Link>
        </div>
      </div>
    </div>
  );
}

