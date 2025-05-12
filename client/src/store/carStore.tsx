// src/store/carStore.js
import { create } from 'zustand';
import axios from 'axios';

const useCarStore = create((set) => ({
  cars: [],
  loading: false,
  error: null,

  fetchCars: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/cars');
      set({ cars: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addCar: (car) => set((state) => ({ cars: [...state.cars, car] })),

  updateCarAvailability: (carId, available) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car._id === carId ? { ...car, available } : car
      )
    })),
}));

export default useCarStore;
