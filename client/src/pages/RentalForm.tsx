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
    departureLocation: 'TANGER',
    returnLocation: 'TANGER',
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Rental</h1>
        <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to register a new rental.</p>
      </div>
      <div className="card p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Client Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaUser className="text-primary-400 text-xs" /> First Name
                </label>
                <input type="text" name="clientFirstName" value={formData.clientFirstName} onChange={handleChange} className="input-modern" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaUser className="text-primary-400 text-xs" /> Last Name
                </label>
                <input type="text" name="clientLastName" value={formData.clientLastName} onChange={handleChange} className="input-modern" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaPhone className="text-primary-400 text-xs" /> Phone
                </label>
                <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaEnvelope className="text-primary-400 text-xs" /> Email
                </label>
                <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaBirthdayCake className="text-primary-400 text-xs" /> Date of Birth
                </label>
                <input type="date" name="clientDateOfBirth" value={formData.clientDateOfBirth} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaHome className="text-primary-400 text-xs" /> Address
                </label>
                <input type="text" name="clientAddress" value={formData.clientAddress} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaFlag className="text-primary-400 text-xs" /> Nationality
                </label>
                <select name="clientNationality" value={formData.clientNationality} onChange={handleChange} className="input-modern">
                  <option value="">Select a country</option>
                  {countries && countries.length > 0 && countries.map((country: any) => (
                    <option key={country.code || country.name} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaIdCard className="text-primary-400 text-xs" /> Client ID
                </label>
                <input type="text" name="clientID" value={formData.clientID} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaIdCard className="text-primary-400 text-xs" /> Licence Number
                </label>
                <input type="text" name="clientLicenceNumber" value={formData.clientLicenceNumber} onChange={handleChange} className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-primary-400 text-xs" /> License Issued
                </label>
                <input type="date" name="clientLicenseIssued" value={formData.clientLicenseIssued} onChange={handleChange} className="input-modern" />
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Rental Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaCar className="text-primary-400 text-xs" /> Select Car
                </label>
                <select name="carId" value={formData.carId} onChange={handleChange} className="input-modern" required>
                  <option value="">Select a car</option>
                  {cars.filter((car) => car.available).map((car) => (
                    <option key={car._id} value={car._id}>{car.make} {car.model} - {car.matricule}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-primary-400 text-xs" /> Departure Location
                </label>
                <select name="departureLocation" value={formData.departureLocation} onChange={handleChange} className="input-modern" required>
                  <option value="">Select a city</option>
                  {cities && cities.length > 0 && cities.map((city: any) => (
                    <option key={city.code} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-primary-400 text-xs" /> Return Location
                </label>
                <select name="returnLocation" value={formData.returnLocation} onChange={handleChange} className="input-modern" required>
                  <option value="">Select a city</option>
                  {cities && cities.length > 0 && cities.map((city: any) => (
                    <option key={city.code} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-primary-400 text-xs" /> Start Date
                </label>
                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="input-modern" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-primary-400 text-xs" /> End Date
                </label>
                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="input-modern" required />
                {dateWarning && <p className="mt-1 text-xs text-red-500">{dateWarning}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaMoneyBill className="text-primary-400 text-xs" /> Daily Rate
                </label>
                <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} className="input-modern" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaMoneyBill className="text-primary-400 text-xs" /> Total Price
                </label>
                <input type="number" name="totalPrice" value={formData.totalPrice} readOnly className="input-modern bg-gray-50 cursor-not-allowed" tabIndex={-1} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading || isReturnBeforeStart} className="btn-primary">
              {loading ? 'Creating…' : 'Create Rental'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RentalForm;

