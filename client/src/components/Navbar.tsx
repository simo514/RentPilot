import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, ClipboardList, LayoutDashboard, BarChart2, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

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

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center">
              <Car className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">RentPilot</span>
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* User section with logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.username}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;