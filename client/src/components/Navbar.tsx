import { Link, useLocation } from 'react-router-dom';
import { Car, Users, ClipboardList, LayoutDashboard } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/rentals', label: 'Rentals', icon: ClipboardList },
    { path: '/cars', label: 'Cars', icon: Car },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center">
              <Car className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">CarRental</span>
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;