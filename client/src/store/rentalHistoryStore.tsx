// src/store/rentalHistoryStore.js
import { create } from 'zustand';
import api from '../lib/axios';
import { rental } from '../utils/cars';

// Define the store type
interface rentalStore {
  rentals: rental[];
  loading: boolean;
  error: string | null;
  currentRental: rental | null;
  fetchRentals: () => Promise<void>;
  fetchRentalById: (id: string) => Promise<void>;
}

const useRentalHistoryStore = create<rentalStore>((set) => ({
  rentals: [],
  loading: false,
  error: null,
  currentRental: null,

  fetchRentals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/rentals'); 
      set({ rentals: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch rentals', loading: false });
    }
  },
  fetchRentalById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/rentals/${id}`);
      set({ currentRental: response.data, loading: false }); // ✅ THIS IS THE FIX
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch rental', loading: false });
    }
  },
}));

export default useRentalHistoryStore;
