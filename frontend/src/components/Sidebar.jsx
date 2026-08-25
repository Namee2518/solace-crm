import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Logo from './Logo';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // ignore network errors on logout; clear client session regardless
    }
    logout();
    navigate('/login');
  }

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <Logo size={26} />
        Alphagnito
      </div>

      <nav className="sidebar-nav">
        <button className="sidebar-link active" type="button">
          <span>📇</span> Agents
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-link" type="button" onClick={handleLogout}>
          <span>↩</span> Logout
        </button>
      </div>
    </aside>
  );
}
