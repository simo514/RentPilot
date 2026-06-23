import { create } from 'zustand';
import { moroccanCities, City } from '../utils/moroccanCities';
import { countries as localCountries, Country } from '../utils/countries';

interface CountriesStore {
  countries: Country[];
  cities: City[];
  loading: boolean;
  error: string | null;
  fetchCountries: () => void;
  fetchMoroccanCities: () => void;
}

const useCountriesStore = create<CountriesStore>((set) => ({
  countries: [],
  cities: [],
  loading: false,
  error: null,
  fetchCountries: () => {
    set({ countries: localCountries });
  },
  fetchMoroccanCities: () => {
    const cities = [...moroccanCities].sort((a, b) => a.name.localeCompare(b.name));
    set({ cities });
  },
}));

export default useCountriesStore;
