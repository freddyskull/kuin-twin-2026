import { create } from 'zustand';
import { api } from 'api-client';

interface Service {
  id: string;
  vendorId: string;
  categoryId: string;
  unitId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  basePrice: number;
  isActive: boolean;
  category?: { name: string };
  unit?: { name: string, abbreviation: string };
}

interface Category {
  id: string;
  name: string;
}

interface ServiceUnit {
  id: string;
  name: string;
  abbreviation: string;
}

interface ServicesState {
  services: Service[];
  categories: Category[];
  units: ServiceUnit[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filter: 'all' | 'active' | 'inactive';
  setFilter: (filter: 'all' | 'active' | 'inactive') => void;

  // Actions
  fetchServices: () => Promise<void>;
  fetchMetadata: () => Promise<void>;
  createService: (data: any) => Promise<void>;
  updateService: (id: string, data: any) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string, isActive: boolean) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  categories: [],
  units: [],
  isLoading: false,
  error: null,
  filter: 'all',

  setFilter: (filter) => set({ filter }),

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/services');
      set({ services: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMetadata: async () => {
    try {
      const [categoriesRes, unitsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/service-units')
      ]);
      set({ 
        categories: categoriesRes.data, 
        units: unitsRes.data 
      });
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  },

  createService: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/services', data);
      set((state) => ({ 
        services: [response.data, ...state.services],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateService: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/services/${id}`, data);
      set((state) => ({
        services: state.services.map((s) => (s.id === id ? response.data : s)),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/services/${id}`);
      set((state) => ({
        services: state.services.filter((s) => s.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  toggleServiceStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`/services/${id}`, { isActive });
      set((state) => ({
        services: state.services.map((s) => (s.id === id ? response.data : s))
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
