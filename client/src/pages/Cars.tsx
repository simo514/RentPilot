import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import useCarStore from '../store/carStore';



function Cars() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cars, fetchCars, addCarAsync, updateCarAsync, deleteCarAsync} = useCarStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);


  useEffect(() => {
    fetchCars();
  }, []);


  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '', 
    matricule: '',
    image: '',
    available: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (isEditing && editingCarId) {
        await updateCarAsync(editingCarId, newCar);
      } else {
        await addCarAsync(newCar);
      }
  
      // Reset modal state
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingCarId(null);
      setNewCar({
        make: '',
        model: '',
        year: '',
        matricule: '',
        image: '',
        available: true,
      });
    } catch (error) {
      console.error("Failed to save car:", error);
    }
  };
  const handledelete = async (carId: string) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
    await deleteCarAsync(carId);
    } catch (error) {
      console.error("Failed to delete car:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cars</h1>
        <button
        onClick={() => {
        setIsModalOpen(true);
        setNewCar({
          make: '',
          model: '',
          year: '',
          matricule: '',
          image: '',
          available: true,
        }); // Reset the car state
      }}
  className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
>
          <Plus className="h-5 w-5 mr-2" />
          Add New Car
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="relative h-48">
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  car.available 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {car.available ? 'Available' : 'Rented'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{car.make} {car.model}</h3>
              <p className="text-gray-600">{car.year}</p>
              <p className="text-primary-600 font-semibold mt-2">{car.matricule}</p>
              <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                    setIsModalOpen(true);
                    setIsEditing(true);
                    setEditingCarId(car._id);
                    setNewCar({
                      make: car.make,
                      model: car.model,
                      year: car.year,
                      matricule: car.matricule,
                      image: car.image,
                      available: car.available,
                    });
                  }}
                  className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button 
                onClick={() => {handledelete(car._id)}}
                className="flex items-center px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Car Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">{isEditing ? 'Update Car' : 'Add Car'}
              </h2>
              <button
               onClick={() => {
                 setIsModalOpen(false);
                 setIsEditing(false);
               }}
               className="text-gray-400 hover:text-gray-500">
               <X className="h-6 w-6" />
             </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
                <input
                  type="text"
                  id="make"
                  value={newCar.make}
                  onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  id="model"
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="text"
                  id="year"
                  value={newCar.year}
                  onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="matricule" className="block text-sm font-medium text-gray-700">Matricule</label>
                <input
                  type="sring"
                  id="matricule"
                  value={newCar.matricule}
                  onChange={(e) => setNewCar({ ...newCar, matricule: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Car Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                     const reader = new FileReader();
                     reader.onloadend = () => {
                        setNewCar({ ...newCar, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {isEditing ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cars;