import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, DollarSign, Calendar, Car } from 'lucide-react';

function Dashboard() {
  // Mock data - replace with actual API calls
  const stats = {
    totalRentals: 24,
    revenue: 12500,
    activeRentals: 8,
    availableCars: 15,
  };

  const recentRentals = [
    { id: 1, client: 'John Doe', car: 'Tesla Model 3', startDate: '2024-03-01', endDate: '2024-03-05', price: 500 },
    { id: 2, client: 'Jane Smith', car: 'BMW X5', startDate: '2024-03-02', endDate: '2024-03-07', price: 750 },
    // Add more mock data as needed
  ];

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
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRentals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-primary-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.revenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-primary-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rentals</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeRentals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <Car className="h-10 w-10 text-primary-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Cars</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.availableCars}</p>
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
                {recentRentals.map((rental) => (
                  <tr key={rental.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.car}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.endDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${rental.price}</td>
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