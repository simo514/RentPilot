// src/store/carStore.ts
import { create } from 'zustand';
import axios from '../lib/axios'; // if you're using a custom axios instance

// Define the Car type
export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  matricule: string;
  image: string;
  available: boolean;
}

// Define the store type
interface CarStore {
  cars: Car[];
  loading: boolean;
  error: string | null;
  fetchCars: () => Promise<void>;
  addCar: (car: Car) => void;
  updateCarAvailability: (carId: string, available: boolean) => void;
}

const useCarStore = create<CarStore>((set) => ({
  cars: [],
  loading: false,
  error: null,

  fetchCars: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/cars');
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
}));

export default useCarStore;
