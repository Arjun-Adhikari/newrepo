import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Link
          to="/"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isActive('/') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
        >
          Add Data
        </Link>
        <Link
          to="/manage"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isActive('/manage') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}
        >
          Manage
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">{user?.username}</p>
          <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1.5 text-sm bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}