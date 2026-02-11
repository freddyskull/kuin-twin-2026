import { create } from 'zustand';

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
      const response = await fetch('http://localhost:3001/companies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar empresas');
      const data = await response.json();
      set({ companies: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createCompany: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:3001/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear empresa');
      await get().fetchCompanies();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/companies/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar empresa');
      await get().fetchCompanies();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al eliminar empresa');
      await get().fetchCompanies();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getCompanyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/companies/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar empresa');
      const data = await response.json();
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
}));
