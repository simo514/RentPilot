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
  getTemplate: () => Promise<any | null>;
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
        rentals: [...state.rentals, response.data.rental || response.data],
        loading: false,
      }));
      toast.success(response.data.message || 'Rental created!'); // Use response message
    } catch (error: any) {   
      set({ error: error instanceof Error ? error.message : 'Failed to create rental', loading: false });
      toast.error(
        error?.response?.data?.message || 'Failed to create rental'
      ); // Use error response message
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
  },
  getTemplate: async () => {
    try {
      const response = await api.get('/api/templates');
      // The backend returns an array, so return the first template or null
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      toast.error('Failed to fetch contract template');
      return null;
    }
  },
}));

export default useRentalHistoryStore;
