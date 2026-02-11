import { create } from 'zustand';
import { api } from 'api-client';

export interface Company {
  id: string;
  businessName: string;
  logoUrl?: string;
  description?: string;
  rfc: string;
  legalName: string;
  fiscalRegime: string;
  taxAddress: string;
  taxAddressZip: string;
  taxAddressCity: string;
  taxAddressState: string;
  taxAddressCounty?: string;
  isSatVerified: boolean;
  satVerifiedAt?: string;
  satCertificateUrl?: string;
  satVerificationDoc?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  _count?: {
    branches: number;
    profiles: number;
  };
}

interface CompaniesState {
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  createCompany: (data: Partial<Company>) => Promise<void>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompanyById: (id: string) => Promise<Company | null>;
}

export const useCompaniesStore = create<CompaniesState>((set, get) => ({
  companies: [],
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/companies');
      set({ companies: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al cargar empresas';
      set({ error: message, isLoading: false });
    }
  },

  createCompany: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/companies', data);
      await get().fetchCompanies();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al crear empresa';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/companies/${id}`, data);
      await get().fetchCompanies();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al actualizar empresa';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/companies/${id}`);
      await get().fetchCompanies();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al eliminar empresa';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getCompanyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/companies/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al cargar empresa';
      set({ error: message, isLoading: false });
      return null;
    }
  },
}));
