import React from 'react';

function RentalForm() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Rental</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">
              Client Phone
            </label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
              Client Email
            </label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="car" className="block text-sm font-medium text-gray-700">
              Select Car
            </label>
            <select
              id="car"
              name="car"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select a car</option>
              {/* Car options will be populated from API */}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Rental
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RentalForm;