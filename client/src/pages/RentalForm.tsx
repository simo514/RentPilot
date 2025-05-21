import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added import
import useCarStore from '../store/carStore';
import useRentalHistoryStore from '../store/rentalHistoryStore';

function RentalForm() {
  const { cars, fetchCars } = useCarStore();
  const { createRental, loading } = useRentalHistoryStore();
  const navigate = useNavigate(); // Added navigate hook

  const [formData, setFormData] = useState({
    clientFirstName: '',
    clientLastName: '',
    clientPhone: '',
    clientEmail: '',
    dailyRate: 0,
    carId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

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
      },
      carId: selectedCar._id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dailyRate: formData.dailyRate,
    };

    await createRental(rentalData);
    navigate('/rentals'); // Redirect to rental history page
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Rental</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client First Name</label>
            <input
              type="text"
              name="clientFirstName"
              value={formData.clientFirstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Last Name</label>
            <input
              type="text"
              name="clientLastName"
              value={formData.clientLastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Phone</label>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Car</label>
            <select
              name="carId"
              value={formData.carId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="">Select a car</option>
              {cars
                .filter((car) => car.available) // Filter only available cars
                .map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.make} {car.model}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
            <input
              type="number"
              name="dailyRate" // Corrected from "DailyRate" to "dailyRate"
              value={formData.dailyRate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
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
