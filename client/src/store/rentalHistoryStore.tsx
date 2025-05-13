// src/store/rentalHistoryStore.js
import { create } from 'zustand';
import api from '../lib/axios';
import { rental } from '../utils/cars';

// Define the store type
interface rentalStore {
  rentals: rental[];
  loading: boolean;
  error: string | null;
  fetchRentals: () => Promise<void>;
}

const useRentalHistoryStore = create<rentalStore>((set) => ({
  rentals: [],
  loading: false,
  error: null,

  fetchRentals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/rentals'); 
      set({ rentals: response.data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch rentals', loading: false });
    }
  }
}));

export default useRentalHistoryStore;
