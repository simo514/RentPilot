import { Link } from 'react-router-dom';
import { PlusCircle, DollarSign, Calendar, Car, TrendingUp, ArrowRight } from 'lucide-react';
import useCarStore from '../store/carStore';
import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { rental } from '../utils/cars';

function Dashboard() {
  const { fetchCars, cars } = useCarStore();
  const [recentRentals, setRecentRentals] = useState<rental[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const recentResponse = await api.get('/api/rentals?limit=5&sort=-createdAt');
        const recent = recentResponse.data.rentals || recentResponse.data;
        setRecentRentals(recent);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const rentalsThisMonth = recentRentals.filter((rental: rental) => {
    const startDate = rental.startDate ? new Date(rental.startDate) : null;
    return (
      startDate &&
      startDate.getMonth() === currentMonth &&
      startDate.getFullYear() === currentYear
    );
  });

  const totalRevenue = rentalsThisMonth.reduce(
    (sum: number, rental: rental) => sum + (typeof rental.totalPrice === 'number' ? rental.totalPrice : 0),
    0
  );

  const stats = [
    {
      label: 'Rentals This Month',
      value: rentalsThisMonth.length,
      icon: Calendar,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Revenue This Month',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Active Rentals',
      value: recentRentals.filter((r: rental) => r.status === 'active').length,
      icon: TrendingUp,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      label: 'Available Cars',
      value: cars.filter((car) => car.available).length,
      icon: Car,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-7 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/rentals/new" className="btn-primary">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Rental
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-200">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${bg} shrink-0`}>
              <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
              <p className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Rentals */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Rentals</h2>
          <Link
            to="/rentals"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-3">Loading rentals…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50/60">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Start</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">End</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentRentals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center">
                      <Car className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-400">No rentals yet</p>
                      <p className="text-xs text-gray-400 mt-1">Create your first rental to get started.</p>
                    </td>
                  </tr>
                ) : (
                  recentRentals.map((rental: rental) => (
                    <tr key={rental._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {rental.client ? `${rental.client.firstName} ${rental.client.lastName}` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {rental.car ? `${rental.car.make} ${rental.car.model}` : 'N/A'}
                        </span>
                        {rental.car?.matricule && (
                          <span className="block text-xs text-gray-400 mt-0.5">{rental.car.matricule}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                        {rental.startDate ? new Date(rental.startDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                        {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {rental.totalPrice !== undefined ? `$${rental.totalPrice}` : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;