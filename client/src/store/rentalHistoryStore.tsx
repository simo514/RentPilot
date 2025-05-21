// src/store/rentalHistoryStore.js
import { create } from 'zustand';
import api from '../lib/axios';
import { rental, RentalCreationData } from '../utils/cars';
import { toast } from 'react-toastify';


// Define the store type
interface rentalStore {
  rentals: rental[];
  loading: boolean;
  error: string | null;
  currentRental: rental | null;
  fetchRentals: () => Promise<void>;
  fetchRentalById: (id: string) => Promise<void>;
  returnCar: (id: string) => Promise<void>;
  createRental: (rentalData: RentalCreationData) => Promise<void>;
}

const useRentalHistoryStore = create<rentalStore>((set) => ({
  rentals: [],
  loading: false,
  error: null,
  currentRental: null,

  createRental: async (rentalData: RentalCreationData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/rentals', rentalData);
      set((state) => ({
        rentals: [...state.rentals, response.data],
        loading: false,
      }));
      toast.success('Rental created successfully!'); // Success toast
    } catch (error) {   
      set({ error: error instanceof Error ? error.message : 'Failed to create rental', loading: false });
      toast.error('Failed to create rental'); // Error toast
    }
  },

  fetchRentals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/rentals'); 
      set({ rentals: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch rentals', loading: false });
      toast.error('Failed to fetch rentals'); // Error toast
    }
  },
  fetchRentalById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/rentals/${id}`);
      set({ currentRental: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch rental', loading: false });
      toast.error('Failed to fetch rental details'); // Error toast
    }
  },
  returnCar: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/api/rentals/${id}/return`);
      set((state) => ({
        rentals: state.rentals.map((rental) =>
          rental._id === id ? { ...rental, status: 'completed' } : rental
        ),
        currentRental: response.data,
        loading: false,
      }));
      toast.success('Car returned successfully!'); // Success toast
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to return car', loading: false });
      toast.error('Failed to return car'); // Error toast
    }
  }
}));

export default useRentalHistoryStore;
