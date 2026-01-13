import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function ProfileDropdown() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      api.get(`/users/me/${user.id}`).then((res) => {
        const userData = res.data;
        setProfile({
          firstName: userData.profile?.firstName || '',
          lastName: userData.profile?.lastName || '',
          phone: userData.profile?.phone || '',
          city: userData.profile?.city || '',
        });
      });
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.put(`/users/profile/${user.id}`, profile);
      if (res.data) {
        setUser({ ...user, ...res.data });
      }
      setIsEditing(false);
      setIsOpen(false);
    } catch (err: any) {
      alert('Xatolik: ' + (err.response?.data?.message || 'Noma\'lum xatolik'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const displayName = profile.firstName && profile.lastName 
    ? `${profile.firstName} ${profile.lastName}` 
    : user.login;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#e2e8f0',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <span>{displayName}</span>
        <span style={{ fontSize: '12px' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '12px',
            padding: '12px',
            minWidth: '200px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
            zIndex: 10000,
          }}
        >
          {isEditing ? (
            <div>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Profileni tahrirlash</div>
              <input
                className="input"
                placeholder="Ism"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                style={{ marginBottom: 8, fontSize: 13, padding: '8px 12px' }}
              />
              <input
                className="input"
                placeholder="Familiya"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                style={{ marginBottom: 8, fontSize: 13, padding: '8px 12px' }}
              />
              <input
                className="input"
                placeholder="Telefon (ixtiyoriy)"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{ marginBottom: 8, fontSize: 13, padding: '8px 12px' }}
              />
              <input
                className="input"
                placeholder="Shahar (ixtiyoriy)"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                style={{ marginBottom: 12, fontSize: 13, padding: '8px 12px' }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button 
                  onClick={handleSave} 
                  disabled={loading} 
                  style={{ 
                    flex: 1, 
                    fontSize: 13, 
                    padding: '8px 12px',
                    background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setIsOpen(false);
                  }}
                  style={{ 
                    flex: 1, 
                    fontSize: 13, 
                    padding: '8px 12px',
                    background: 'transparent',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  Bekor
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                onClick={() => setIsEditing(true)}
                style={{ 
                  width: '100%', 
                  fontSize: 14, 
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ✏️ Profileni tahrirlash
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  fontSize: 14,
                  padding: '10px 16px',
                  background: 'transparent',
                  color: '#e11d48',
                  border: '1px solid #e11d48',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                🚪 Chiqish
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

