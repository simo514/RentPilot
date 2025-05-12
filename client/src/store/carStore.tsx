// src/store/carStore.ts
import { create } from 'zustand';
import { Car } from '../utils/cars';
import api from '../lib/axios';

// Define the store type
interface CarStore {
  cars: Car[];
  loading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  addCar: (car: Car) => void;
  addCarAsync: (car: Omit<Car, '_id'>) => Promise<void>;
  updateCarAvailability: (carId: string, available: boolean) => void;
  updateCarAsync: (id: string, updatedData: Partial<Car>) => Promise<void>; 
}

const useCarStore = create<CarStore>((set) => ({
  cars: [],
  loading: false,
  error: null,

  fetchCars: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/cars');
      set({ cars: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addCar: (car) =>
    set((state) => ({
      cars: [...state.cars, car],
    })),

  updateCarAvailability: (carId, available) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car._id === carId ? { ...car, available } : car
      ),
    })),
    addCarAsync: async (car) => {
      try {
        const res = await api.post('/api/cars', car);
        set((state) => ({
          cars: [...state.cars, res.data],
        }));
      } catch (err: any) {
        set({ error: err.message });
      }
    },
    updateCarAsync: async (id, updatedData) => {
      try {
        const response = await api.put(`/api/cars/${id}`, updatedData);
        set((state) => ({
          cars: state.cars.map((car) =>
            car._id === id ? response.data : car
          ),
        }));
      } catch (error) {
        console.error('Failed to update car:', error);
      }
    },
    
}));

export default useCarStore;
