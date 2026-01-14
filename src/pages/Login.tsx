import { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login: loginUser, user } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  console.log('Login page render - user:', user);

  // Remove auto-redirect - let user access login page even if logged in

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { login, password });
      loginUser(res.data.accessToken, res.data.user);
      // Navigate to admin panel if admin, otherwise to dashboard
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
          Login
        </div>
        <h2 style={{ margin: 0, marginBottom: 8 }}>Welcome</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 18 }}>
          Enter your credentials to access the IELTS platform.
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
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div style={{ color: '#e11d48', fontWeight: 600 }}>{error}</div>}
          <button className="btn" type="submit">
            Login
          </button>
        </form>
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <span className="muted">Don't have an account? </span>
          <Link className="link" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

