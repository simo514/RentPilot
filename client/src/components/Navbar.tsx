import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, ClipboardList, LayoutDashboard, BarChart2, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/rentals', label: 'Rentals', icon: ClipboardList },
    { path: '/cars', label: 'Cars', icon: Car },
    { path: '/report', label: 'Report', icon: BarChart2 },
  ];

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'RP';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 shadow-sm">
              <Car className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-bold text-gray-900 tracking-tight">RentPilot</span>
          </Link>

          {/* Nav items */}
          <div className="flex items-center gap-1 h-full">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive(path)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={isActive(path) ? 2.5 : 2} />
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* User area */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user.username}
                </span>
              </div>
            )}
            <div className="w-px h-5 bg-gray-200" />
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;