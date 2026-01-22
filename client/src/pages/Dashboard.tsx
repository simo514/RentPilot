import { Link } from 'react-router-dom';
import { PlusCircle, DollarSign, Calendar, Car } from 'lucide-react';
import useCarStore from '../store/carStore';
import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { rental } from '../utils/cars';

function Dashboard() {
  const { fetchCars, cars } = useCarStore();
  const [recentRentals, setRecentRentals] = useState<rental[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch only 5 most recent rentals for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch recent 5 rentals
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

  // Calculate stats from fetched data
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

  const totalRentalsThisMonth = rentalsThisMonth.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/rentals/new"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Rental
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-primary-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Rentals</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRentalsThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-primary-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${totalRevenue}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-primary-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rentals</p>
              <p className="text-2xl font-semibold text-gray-900">{recentRentals.filter((rental: rental) => rental.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <Car className="h-10 w-10 text-primary-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Cars</p>
              <p className="text-2xl font-semibold text-gray-900">
                {cars.filter((car) => car.available).length} {/* Dynamically show available cars */}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Rentals</h2>
            <Link 
              to="/rentals" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading rentals...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentRentals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No rentals found. Create your first rental to get started!
                      </td>
                    </tr>
                  ) : (
                    recentRentals.map((rental: rental) => (
                  <tr key={rental._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.client
                        ? `${rental.client.firstName} ${rental.client.lastName}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.car
                        ? `${rental.car.make} ${rental.car.model}`
                        : 'N/A'}
                      <span className="block text-xs text-gray-500">
                        {rental.car ? rental.car.matricule : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.startDate
                        ? new Date(rental.startDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.endDate
                        ? new Date(rental.endDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rental.totalPrice !== undefined ? `$${rental.totalPrice}` : 'N/A'}
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
    </div>
  );
}

export default Dashboard;