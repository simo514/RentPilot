import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Car as CarIcon } from 'lucide-react';
import useCarStore from '../store/carStore';

function Cars() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cars, fetchCars, addCarAsync, updateCarAsync, deleteCarAsync } = useCarStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const resetCar = () => ({
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
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingCarId(null);
      setNewCar(resetCar());
    } catch (error) {
      console.error('Failed to save car:', error);
    }
  };

  const handleDelete = async (carId: string) => {
    setConfirmDeleteId(carId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteCarAsync(confirmDeleteId);
    } catch (error) {
      console.error('Failed to delete car:', error);
    }
    setShowConfirmDialog(false);
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-7 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cars</h1>
          <p className="text-sm text-gray-500 mt-0.5">{cars.length} vehicle{cars.length !== 1 ? 's' : ''} in fleet</p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setNewCar(resetCar());
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Car
        </button>
      </div>

      {/* Cars grid */}
      {cars.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
            <CarIcon className="h-7 w-7 text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700">No cars in your fleet yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Car" to add your first vehicle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => (
            <div
              key={car._id}
              className="card overflow-hidden group hover:shadow-card-hover transition-shadow duration-200"
            >
              {/* Image */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={car.available ? 'badge-available' : 'badge-rented'}>
                    <span className={`w-1.5 h-1.5 rounded-full ${car.available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {car.available ? 'Available' : 'Rented'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 leading-snug">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{car.year}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100">
                    {car.matricule}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
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
                    className="btn-secondary flex-1 text-xs py-2"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-medium border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-all duration-150 shadow-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Car' : 'Add New Car'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1.5">Make</label>
                  <input
                    type="text"
                    id="make"
                    value={newCar.make}
                    onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                    className="input-modern"
                    placeholder="e.g. Toyota"
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1.5">Model</label>
                  <input
                    type="text"
                    id="model"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    className="input-modern"
                    placeholder="e.g. Corolla"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
                  <input
                    type="text"
                    id="year"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                    className="input-modern"
                    placeholder="e.g. 2022"
                  />
                </div>
                <div>
                  <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 mb-1.5">Matricule</label>
                  <input
                    type="text"
                    id="matricule"
                    value={newCar.matricule}
                    onChange={(e) => setNewCar({ ...newCar, matricule: e.target.value })}
                    className="input-modern"
                    placeholder="e.g. AB-123-CD"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1.5">Car Image</label>
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
                  className="input-modern file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-primary w-full">
                  {isEditing ? 'Save Changes' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Car</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this car? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={cancelDelete} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cars;