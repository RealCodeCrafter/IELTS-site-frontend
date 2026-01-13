import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';

interface ProfileSidebarProps {
  onClose?: () => void;
}

export default function ProfileSidebar({ onClose }: ProfileSidebarProps) {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.put(`/users/profile/${user.id}`, profile);
      // Update user in context
      if (res.data) {
        setUser({ ...user, ...res.data });
      }
      setIsEditing(false);
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
    <div className="profile-sidebar">
      <div className="profile-header">
        <div className="profile-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="profile-name">{displayName}</div>
        <div className="profile-role">{user.role === 'admin' ? 'Administrator' : 'Talaba'}</div>
      </div>

      {isEditing ? (
        <div className="profile-edit-form">
          <input
            className="input"
            placeholder="Ism"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <input
            className="input"
            placeholder="Familiya"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <input
            className="input"
            placeholder="Telefon (ixtiyoriy)"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <input
            className="input"
            placeholder="Shahar (ixtiyoriy)"
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={handleSave} disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
            <button 
              className="btn ghost" 
              onClick={() => setIsEditing(false)}
              style={{ flex: 1 }}
            >
              Bekor
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-actions">
          <button className="btn" onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
            ✏️ Profileni tahrirlash
          </button>
          <button 
            className="btn ghost" 
            onClick={() => {
              logout();
              navigate('/login');
            }} 
            style={{ 
              width: '100%', 
              marginTop: 8,
              color: '#e11d48',
              borderColor: '#e11d48'
            }}
          >
            🚪 Chiqish
          </button>
          {onClose && (
            <button className="btn ghost" onClick={onClose} style={{ width: '100%', marginTop: 8 }}>
              Yopish
            </button>
          )}
        </div>
      )}
    </div>
  );
}

