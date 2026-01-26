import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Car, Eye, User, X  } from 'lucide-react';
import useRentalHistoryStore from '../store/rentalHistoryStore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


import { useNavigate } from 'react-router-dom';

function RentalHistory() {
 
  const Navigate = useNavigate();
  const { rentals, loading, error, fetchRentals } = useRentalHistoryStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Fetch rentals filtered by the selected month and year
    fetchRentals(date.getMonth(), date.getFullYear());
  }, [date, fetchRentals]);

  const handleDateChange = (value: Date) => {
    setDate(value);
    setShowCalendar(false);
    // fetchRentals will be called by useEffect when date changes
  };

  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Rental History</h1>
      <button
        onClick={() => setShowCalendar(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Open calendar"
      >
        <CalendarIcon className="h-6 w-6 text-primary-600" />
      </button>
    </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">Client</th>
            <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">Car</th>
            <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">Start Date</th>
            <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">End Date</th>
            <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">Status</th>
            <th className="sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rentals.length > 0 ? (
                [...rentals]
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((rental) => (
                    <tr key={rental._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{rental.client.firstName} {rental.client.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {rental.car.make} {rental.car.model}
                            <span className="block text-xs text-gray-500">{rental.car.matricule}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(rental.startDate))}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(rental.endDate))}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rental.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-gray-800'
                        }`}>
                          {rental.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {Navigate(`/rental/${rental._id}`)}}
                          className="text-primqry-600 hover:text-primary-900 tranistion-colors">
                          <Eye className='h-5 w-5' />
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
            {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <Calendar
              onChange={(value) => handleDateChange(value as Date)}
              value={date}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-4"
              tileClassName="rounded-full hover:bg-primary-100"
              navigationLabel={({ date }) =>
                date.toLocaleDateString('default', { month: 'long', year: 'numeric' })
              }
              prevLabel={<span className="text-primary-600">←</span>}
              nextLabel={<span className="text-primary-600">→</span>}
              minDetail="month"
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default RentalHistory;