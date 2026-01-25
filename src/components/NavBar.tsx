import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileDropdown from './ProfileDropdown';

export default function NavBar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="nav">
      <div className="nav-brand">
        <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} style={{ textDecoration: 'none', color: 'inherit' }}>
          BandMaster
        </Link>
      </div>
      
      {user && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Link
            to={user?.role === 'admin' ? '/admin' : '/dashboard'}
            style={{
              textDecoration: 'none',
              color: isActive(user?.role === 'admin' ? '/admin' : '/dashboard') ? '#2563eb' : '#64748b',
              fontWeight: isActive(user?.role === 'admin' ? '/admin' : '/dashboard') ? 600 : 400,
              fontSize: '15px',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isActive(user?.role === 'admin' ? '/admin' : '/dashboard')) {
                e.currentTarget.style.background = '#f1f5f9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            🏠 Home
          </Link>
          
          {user?.role === 'admin' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  const event = new CustomEvent('admin-tab-change', { detail: 'exams' });
                  window.dispatchEvent(event);
                }}
                style={{
                  textDecoration: 'none',
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontWeight: 400,
                  fontSize: '15px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                📚 Exams
              </button>
              <button
                type="button"
                onClick={() => {
                  const event = new CustomEvent('admin-tab-change', { detail: 'payments' });
                  window.dispatchEvent(event);
                }}
                style={{
                  textDecoration: 'none',
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontWeight: 400,
                  fontSize: '15px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                💰 Payments
              </button>
            </>
          ) : (
            <>
              <Link
                to="/payment"
                style={{
                  textDecoration: 'none',
                  color: isActive('/payment') ? '#2563eb' : '#64748b',
                  fontWeight: isActive('/payment') ? 600 : 400,
                  fontSize: '15px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/payment')) {
                    e.currentTarget.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                💰 Payment
              </Link>
            </>
          )}
        </div>
      )}
      
      <div className="nav-spacer">
        {user && <ProfileDropdown />}
      </div>
    </div>
  );
}

