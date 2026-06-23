import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Car, Eye, User, X } from 'lucide-react';
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
    fetchRentals(date.getMonth(), date.getFullYear());
  }, [date, fetchRentals]);

  const handleDateChange = (value: Date) => {
    setDate(value);
    setShowCalendar(false);
  };

  const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-7 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rental History</h1>
          <p className="text-sm text-gray-500 mt-0.5">Showing rentals for {monthLabel}</p>
        </div>
        <button
          onClick={() => setShowCalendar(true)}
          className="btn-secondary"
          aria-label="Filter by month"
        >
          <CalendarIcon className="h-4 w-4 mr-2 text-primary-500" />
          {monthLabel}
        </button>
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[560px] overflow-y-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50/60 sticky top-0 z-10">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Start</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">End</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="inline-block w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-400 mt-3">Loading rentals…</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-red-500">{error}</td>
                  </tr>
                ) : rentals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Car className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-400">No rentals for {monthLabel}</p>
                    </td>
                  </tr>
                ) : (
                  [...rentals]
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .map((rental) => (
                      <tr key={rental._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 shrink-0">
                              <User className="h-3.5 w-3.5 text-gray-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {rental.client.firstName} {rental.client.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {rental.car.make} {rental.car.model}
                          </span>
                          <span className="block text-xs text-gray-400 mt-0.5">{rental.car.matricule}</span>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                          {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(rental.startDate))}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                          {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(rental.endDate))}
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className={rental.status === 'active' ? 'badge-active' : 'badge-completed'}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rental.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                            {rental.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <button
                            onClick={() => Navigate(`/rental/${rental._id}`)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Select Month</h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Calendar
              onChange={(value) => handleDateChange(value as Date)}
              value={date}
              className="!border-none"
              tileClassName="rounded-lg"
              navigationLabel={({ date }) =>
                date.toLocaleDateString('default', { month: 'long', year: 'numeric' })
              }
              prevLabel={<span className="text-primary-600 font-medium">←</span>}
              nextLabel={<span className="text-primary-600 font-medium">→</span>}
              minDetail="month"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RentalHistory;