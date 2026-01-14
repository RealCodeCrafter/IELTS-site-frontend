import { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [form, setForm] = useState({
    login: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  console.log('Register page render - user:', user);

  // Remove auto-redirect - let user access register page even if logged in

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="pill" style={{ marginBottom: 10 }}>
          Register
        </div>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Create Account</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 18 }}>
          Enter your information to use the IELTS platform.
        </p>
        <form onSubmit={handleSubmit} className="grid">
          <input className="input" placeholder="Login" onChange={(e) => update('login', e.target.value)} />
          <input
            className="input"
            placeholder="Password (min 6 characters)"
            type="password"
            onChange={(e) => update('password', e.target.value)}
          />
          <div className="grid two">
            <input className="input" placeholder="First Name" onChange={(e) => update('firstName', e.target.value)} />
            <input className="input" placeholder="Last Name" onChange={(e) => update('lastName', e.target.value)} />
          </div>
          {error && <div style={{ color: '#e11d48', fontWeight: 600 }}>{error}</div>}
          <button className="btn" type="submit">
            Continue
          </button>
        </form>
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <span className="muted">Already have an account? </span>
          <Link className="link" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

