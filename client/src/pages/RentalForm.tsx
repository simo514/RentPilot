import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added import
import useCarStore from '../store/carStore';
import useRentalHistoryStore from '../store/rentalHistoryStore';
import useCountriesStore from '../store/countriesStore';
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaHome, FaFlag, FaIdCard, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBill } from 'react-icons/fa';

function RentalForm() {
  const { cars, fetchCars } = useCarStore();
  const { loading } = useRentalHistoryStore();
  const { countries, fetchCountries, cities, fetchMoroccanCities } = useCountriesStore();
  const navigate = useNavigate(); // Added navigate hook

  const [formData, setFormData] = useState({
    clientFirstName: '',
    clientLastName: '',
    clientPhone: '',
    clientEmail: '',
    clientDateOfBirth: '',
    clientAddress: '',
    clientNationality: '',
    clientID: '',
    clientLicenceNumber: '',
    clientLicenseIssued: '',
    carId: '',
    departureLocation: '',
    returnLocation: '',
    startDate: (() => {
      // Set startDate to current date and time in 'YYYY-MM-DDTHh:mm' 24-hour format for input type="datetime-local"
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const yyyy = now.getFullYear();
      const mm = pad(now.getMonth() + 1);
      const dd = pad(now.getDate());
      const hh = pad(now.getHours());
      const min = pad(now.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    })(),
    endDate: (() => {
      // Set endDate to current date and time (same as startDate)
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const yyyy = now.getFullYear();
      const mm = pad(now.getMonth() + 1);
      const dd = pad(now.getDate());
      const hh = pad(now.getHours());
      const min = pad(now.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    })(),
    dailyRate: 0,
    totalPrice: 0, // Added totalPrice
  });

  // Add state for date validation
  const [dateWarning, setDateWarning] = useState('');

  useEffect(() => {
    fetchCars();
    fetchCountries();
    fetchMoroccanCities();
  }, [fetchCars, fetchCountries, fetchMoroccanCities]);

  // Add effect to check date validity
  useEffect(() => {
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      setDateWarning('⚠️ Return date cannot be before start date.');
    } else {
      setDateWarning('');
    }
  }, [formData.startDate, formData.endDate]);

  // Calculate totalPrice when dates or dailyRate change
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.dailyRate > 0) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      // Calculate difference in days (not inclusive)
      const diffTime = end.getTime() - start.getTime();
      const diffDays = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
      // Updated calculation: (dailyRate * days + 80 * days) * 1.2
      const base = diffDays > 0 ? (Number(formData.dailyRate) * diffDays + 80 * diffDays) : 0;
      const total = base > 0 ? Math.round(base * 1.2) : 0;
      setFormData((prev) => ({ ...prev, totalPrice: total }));
    } else {
      setFormData((prev) => ({ ...prev, totalPrice: 0 }));
    }
  }, [formData.startDate, formData.endDate, formData.dailyRate]);

  // Add a variable to disable button if endDate is after startDate
  const isReturnBeforeStart =
    !!formData.startDate &&
    !!formData.endDate &&
    new Date(formData.endDate) < new Date(formData.startDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCar = cars.find((car) => car._id === formData.carId);

    if (!selectedCar) {
      alert('Selected car not found');
      return;
    }

    const rentalData = {
      client: {
        firstName: formData.clientFirstName,
        lastName: formData.clientLastName,
        phone: formData.clientPhone,
        email: formData.clientEmail,
        dateOfBirth: formData.clientDateOfBirth,
        address: formData.clientAddress,
        nationality: formData.clientNationality,
        clientID: formData.clientID,
        licenceNumber: formData.clientLicenceNumber,
        clientLicenseIssued: formData.clientLicenseIssued,
      },
      carId: selectedCar._id,
      departureLocation: formData.departureLocation,
      returnLocation: formData.returnLocation,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dailyRate: formData.dailyRate,
      totalPrice: (() => {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
        // Updated calculation: (dailyRate * days + 80 * days) * 1.2
        const base = diffDays > 0 ? (Number(formData.dailyRate) * diffDays + 80 * diffDays) : 0;
        return base > 0 ? Math.round(base * 1.2) : 0;
      })(),
      rentalDuration: (() => {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
        return diffDays;
      })(),
      createdAt: (() => {
        // Use ISO string for valid date
        return new Date().toISOString();
      })(),
    };

    // 🔸 Save to localStorage
    localStorage.setItem('rentalSummary', JSON.stringify(rentalData));
    localStorage.setItem('car', JSON.stringify(selectedCar));

    // 🔸 Navigate to summary page
    navigate('/rental-summary');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Rental</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Client Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaUser className="text-yellow-400" /> Client First Name
              </label>
              <input
                type="text"
                name="clientFirstName"
                value={formData.clientFirstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaUser className="text-yellow-400" /> Client Last Name
              </label>
              <input
                type="text"
                name="clientLastName"
                value={formData.clientLastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaPhone className="text-yellow-400" /> Client Phone
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                // removed required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaEnvelope className="text-yellow-400" /> Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                // removed required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaBirthdayCake className="text-yellow-400" /> Client Date of Birth
              </label>
              <input
                type="date"
                name="clientDateOfBirth"
                value={formData.clientDateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50 text-gray-700 placeholder-gray-400 appearance-none"
                // removed required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaHome className="text-yellow-400" /> Client Address
              </label>
              <input
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                // removed required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaFlag className="text-yellow-400" /> Client Nationality
              </label>
              <select
                name="clientNationality"
                value={formData.clientNationality}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
              >
                <option value="">Select a country</option>
                {countries && countries.length > 0 && countries.map((country: any) => (
                  <option key={country.code || country.name} value={country.name}>{country.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaIdCard className="text-yellow-400" /> Client ID
              </label>
              <input
                type="text"
                name="clientID"
                value={formData.clientID}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                // removed required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaIdCard className="text-yellow-400" /> Licence Number
              </label>
              <input
                type="text"
                name="clientLicenceNumber"
                value={formData.clientLicenceNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                // removed required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-400" /> Client License Issued
              </label>
              <input
                type="date"
                name="clientLicenseIssued"
                value={formData.clientLicenseIssued}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50 text-gray-700 placeholder-gray-400 appearance-none"
                // removed required
              />
            </div>
            {/* Car Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaCar className="text-yellow-400" /> Select Car
              </label>
              <select
                name="carId"
                value={formData.carId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                required
              >
                <option value="">Select a car</option>
                {cars
                  .filter((car) => car.available)
                  .map((car) => (
                    <option key={car._id} value={car._id}>
                      {car.make} {car.model} - {car.matricule}
                    </option>
                  ))}
              </select>
            </div>
            {/* Departure & Return Locations (Dropdowns) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400" /> Departure Location
              </label>
              <select
                name="departureLocation"
                value={formData.departureLocation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                required
              >
                <option value="">Select a city</option>
                {cities && cities.length > 0 && cities.map((city: any) => (
                  <option key={city.code} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400" /> Return Location
              </label>
              <select
                name="returnLocation"
                value={formData.returnLocation}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                required
              >
                <option value="">Select a city</option>
                {cities && cities.length > 0 && cities.map((city: any) => (
                  <option key={city.code} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-400" /> Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50 text-gray-700 placeholder-gray-400 appearance-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-400" /> End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50 text-gray-700 placeholder-gray-400 appearance-none"
                required
              />
              {dateWarning && (
                <span className="text-xs text-red-500">{dateWarning}</span>
              )}
            </div>
            {/* Daily Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaMoneyBill className="text-yellow-400" /> Daily Rate
              </label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition duration-150 ease-in-out bg-gray-50"
                required
              />
            </div>
            {/* Total Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <FaMoneyBill className="text-yellow-400" /> Total Price
              </label>
              <input
                type="number"
                name="totalPrice"
                value={formData.totalPrice}
                readOnly
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow shadow-md px-3 py-2 bg-gray-100 text-gray-700"
                tabIndex={-1}
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || isReturnBeforeStart}
              className="w-full md:w-auto px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              {loading ? 'Creating...' : 'Create Rental'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RentalForm;

