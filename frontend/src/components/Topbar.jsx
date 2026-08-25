import { useAuth } from '../context/AuthContext';

export default function Topbar({ searchTerm, onSearchChange }) {
  const { user } = useAuth();
  const initials = user?.fullName
    ? user.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="app-topbar">
      <div className="topbar-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-right">
        <span className="topbar-bell">🔔</span>
        <div className="topbar-avatar">{initials}</div>
        <span className="topbar-user-name">{user?.fullName}</span>
      </div>
    </header>
  );
}
