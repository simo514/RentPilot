import React, { useEffect, useState } from 'react';
import useRentalHistoryStore from '../store/rentalHistoryStore';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


import { rental } from '../utils/cars';

function getYearRange(rentals: rental[]): number[] {
  if (!rentals.length) return [new Date().getFullYear()];
  const years: number[] = rentals
    .map((r: rental) => r.startDate ? new Date(r.startDate).getFullYear() : null)
    .filter((y: number | null): y is number => y !== null);
  const min = Math.min(...years);
  const max = Math.max(...years);
  const range: number[] = [];
  for (let y = max; y >= min; y--) range.push(y);
  return range;
}

function Report() {
  const { fetchRentals, rentals } = useRentalHistoryStore();
  const [monthlyReport, setMonthlyReport] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  useEffect(() => {
    // Group rentals by month and filter out months with no rentals for selected year
    const report = months.map((month, idx) => {
      const rentalsInMonth = rentals.filter(rental => {
        const date = rental.startDate ? new Date(rental.startDate) : null;
        return date && date.getMonth() === idx && date.getFullYear() === selectedYear;
      });
      const totalRevenue = rentalsInMonth.reduce(
        (sum, rental) => sum + (typeof rental.totalPrice === 'number' ? rental.totalPrice : 0),
        0
      );
      return {
        month,
        count: rentalsInMonth.length,
        totalRevenue,
      };
    }).filter(row => row.count > 0);
    setMonthlyReport(report);
  }, [rentals, selectedYear]);

  const yearOptions = getYearRange(rentals);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 py-10 px-2 sm:px-0">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-yellow-200">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-yellow-900 tracking-tight flex items-center gap-2">
            <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-yellow-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3v18h18M9 17V9m4 8V5m4 12v-6' /></svg>
            Monthly Report
          </h1>
          <div className="flex items-center gap-2">
            <label htmlFor="year-picker" className="font-medium text-gray-700">Year:</label>
            <select
              id="year-picker"
              className="border border-yellow-100 rounded-lg px-4 py-2 bg-yellow-50 text-yellow-900 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-yellow-200 rounded-xl shadow-sm">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-yellow-200 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 border-b-2 border-yellow-200 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider">Number of Rentals</th>
                <th className="px-6 py-3 border-b-2 border-yellow-200 text-left text-xs font-bold text-yellow-700 uppercase tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {monthlyReport.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-400 text-lg">No rentals for this year.</td>
                </tr>
              ) : (
                monthlyReport.map((row, idx) => (
                  <tr
                    key={row.month}
                    className={`transition hover:bg-yellow-50 ${idx % 2 === 0 ? 'bg-yellow-50/40' : 'bg-white'}`}
                  >
                    <td className="px-6 py-4 border-b border-yellow-50 text-yellow-900 font-medium">{row.month}</td>
                    <td className="px-6 py-4 border-b border-yellow-50">{row.count}</td>
                    <td className="px-6 py-4 border-b border-yellow-50 font-semibold text-green-700">${row.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Report;
