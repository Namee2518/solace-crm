import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

export default function Navbar() {
  const { user, logout } = useAuth();
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
    <nav className="navbar dashboard-navbar navbar-expand px-4 py-3">
      <span className="navbar-brand fw-bold mb-0">Solace CRM</span>
      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-light small">{user?.fullName}</span>
        <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
