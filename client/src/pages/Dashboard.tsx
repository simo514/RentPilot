import { Link } from 'react-router-dom';
import { PlusCircle, DollarSign, Calendar, Car } from 'lucide-react';
import useRentalHistoryStore from '../store/rentalHistoryStore';
import useCarStore from '../store/carStore';
import { useEffect } from 'react';



function Dashboard() {
  const { fetchRentals, rentals } = useRentalHistoryStore();
  const { fetchCars, cars } = useCarStore();

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Calculate total revenue and total rentals for the current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const rentalsThisMonth = rentals.filter(rental => {
    const startDate = rental.startDate ? new Date(rental.startDate) : null;
    return (
      startDate &&
      startDate.getMonth() === currentMonth &&
      startDate.getFullYear() === currentYear
    );
  });

  const totalRevenue = rentalsThisMonth.reduce(
    (sum, rental) => sum + (typeof rental.totalPrice === 'number' ? rental.totalPrice : 0),
    0
  );

  const totalRentalsThisMonth = rentalsThisMonth.length;

  const lastFiveRentals = rentals.slice(-5); // Get the last 5 rentals

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
              <p className="text-2xl font-semibold text-gray-900">{rentals.filter((rental) => rental.status=='active').length}</p>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Rentals</h2>
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
                {lastFiveRentals.map((rental) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;