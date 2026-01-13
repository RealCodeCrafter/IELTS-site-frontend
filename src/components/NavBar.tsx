import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileDropdown from './ProfileDropdown';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <div className="nav">
      <div className="nav-brand">IELTS Hub</div>
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      <div className="nav-spacer">
        {user && <ProfileDropdown />}
      </div>
    </div>
  );
}

