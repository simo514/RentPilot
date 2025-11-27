import { create } from 'zustand';
import { moroccanCities, City } from '../utils/moroccanCities';

interface Country {
  name: string;
  code: string;
}

interface CountriesStore {
  countries: Country[];
  cities: City[];
  loading: boolean;
  error: string | null;
  fetchCountries: () => Promise<void>;
  fetchMoroccanCities: () => Promise<void>;
}

const useCountriesStore = create<CountriesStore>((set) => ({
  countries: [],
  cities: [],
  loading: false,
  error: null,
  fetchCountries: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
      if (!res.ok) throw new Error('Failed to fetch countries');
      const data = await res.json();
      const countries = data
        .map((c: any) => ({
          name: c.name.common,
          code: c.cca2,
        }))
        .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
      set({ countries, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error fetching countries', loading: false });
    }
  },  fetchMoroccanCities: async () => {
    set({ loading: true, error: null });
    try {
      // Using local data instead of API
      const cities = moroccanCities.sort((a, b) => a.name.localeCompare(b.name));
      set({ cities, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error fetching Moroccan cities', loading: false });
    }
  },
}));

export default useCountriesStore;
