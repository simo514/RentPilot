import { useEffect, useState } from 'react';
import useRentalHistoryStore from '../store/rentalHistoryStore';
import { BarChart2 } from 'lucide-react';
import { rental } from '../utils/cars';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
    const report = months.map((month, idx) => {
      const rentalsInMonth = rentals.filter(rental => {
        const date = rental.startDate ? new Date(rental.startDate) : null;
        return date && date.getMonth() === idx && date.getFullYear() === selectedYear;
      });
      const totalRevenue = rentalsInMonth.reduce(
        (sum, rental) => sum + (typeof rental.totalPrice === 'number' ? rental.totalPrice : 0),
        0
      );
      return { month, count: rentalsInMonth.length, totalRevenue };
    }).filter(row => row.count > 0);
    setMonthlyReport(report);
  }, [rentals, selectedYear]);

  const yearOptions = getYearRange(rentals);

  const totalRevenue = monthlyReport.reduce((s, r) => s + r.totalRevenue, 0);
  const totalRentals = monthlyReport.reduce((s, r) => s + r.count, 0);

  return (
    <div className="space-y-7 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">Financial summary by month</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="year-picker" className="text-sm font-medium text-gray-600">Year</label>
          <select
            id="year-picker"
            className="input-modern py-2"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 shrink-0">
            <BarChart2 className="h-5 w-5 text-primary-600" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Rentals ({selectedYear})</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalRentals}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 shrink-0">
            <span className="text-emerald-600 font-bold text-base">$</span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Total Revenue ({selectedYear})</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/60">
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rentals</th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyReport.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    <BarChart2 className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400">No rentals for {selectedYear}</p>
                  </td>
                </tr>
              ) : (
                monthlyReport.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-900">{row.month}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-sm font-semibold">
                        {row.count}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-bold text-emerald-700">${row.totalRevenue.toLocaleString()}</span>
                    </td>
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
