import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Car, CreditCard, MapPin, Phone, User } from 'lucide-react';
import { useEffect } from 'react';
import useRentalHistoryStore from '../store/rentalHistoryStore';

function RentalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentRental: rental, loading, error, fetchRentalById, returnCar } = useRentalHistoryStore();

  useEffect(() => {
    if (id) {
        console.log(rental);
      fetchRentalById(id);
    }
  }, [id, fetchRentalById]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!rental) return <p className="text-center mt-10">Rental not found.</p>;

  return (
  <div className="p-6">
  {/* Top bar with two buttons */}
  <div className="mb-6 flex justify-between items-center">
    <button
      onClick={() => navigate('/rentals')}
      className="flex items-center text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Back to Rental History
    </button>

    {rental.status === 'active' && (
      <button
        className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        onClick={() => {returnCar(rental._id); navigate('/rentals');}}
      >
        Return the car
      </button>
    )}
  </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary-500" />
            Client Information
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">First Name: <span className="text-gray-900">{rental.client.firstName}</span></p>
            <p className="text-gray-600">Last Name: <span className="text-gray-900">{rental.client.lastName}</span></p>
            <p className="text-gray-600">Phone: <span className="text-gray-900">{rental.client.phone}</span></p>
            <p className="text-gray-600">Email: <span className="text-gray-900">{rental.client.email}</span></p>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Car className="h-5 w-5 mr-2 text-primary-500" />
            Vehicle Details
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">Make & Model: <span className="text-gray-900">{rental.car.make} {rental.car.model}</span></p>
            <p className="text-gray-600">Year: <span className="text-gray-900">{rental.car.year}</span></p>
            <p className="text-gray-600">License Plate: <span className="text-gray-900">{rental.car.matricule}</span></p>
          </div>
        </div>

        {/* Rental Period */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-500" />
            Rental Period
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">Start Date: <span className="text-gray-900">  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(rental.startDate))}
            </span></p>
            <p className="text-gray-600">End Date: <span className="text-gray-900">  {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(rental.endDate))}
            </span></p>
            <p className="text-gray-600">Daily Rate: <span className="text-gray-900">${rental.dailyRate}</span></p>
            <p className="text-gray-600">Total Amount: <span className="text-gray-900">${rental.totalPrice}</span></p>
            <p className="text-gray-600">Status: 
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                rental.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-gray-800'
              }`}>
                {rental.status}
              </span>
            </p>
          </div>
        </div>

        {/* Payment Information */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary-500" />
            Payment Information
          </h2>
          <div className="space-y-3">
            <p className="text-gray-600">Payment Method: <span className="text-gray-900">{rental.payment.method}</span></p>
            <p className="text-gray-600">Payment Status: <span className="text-gray-900">{rental.payment.status}</span></p>
            <p className="text-gray-600">Transaction ID: <span className="text-gray-900">{rental.payment.transactionId}</span></p>
          </div>
        </div> */}

        {/* Additional Notes */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
          <p className="text-gray-600">{rental.notes}</p>
        </div> */}
      </div>
    </div>
  );
}

export default RentalDetails;