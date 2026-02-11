import { create } from 'zustand';
import { api } from 'api-client';

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  isMain: boolean;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  county?: string;
  zipCode: string;
  country: string;
  addressNotes?: string;
  businessHours?: any;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface BranchesState {
  branches: Branch[];
  isLoading: boolean;
  error: string | null;
  fetchBranches: (companyId?: string) => Promise<void>;
  createBranch: (data: Partial<Branch>) => Promise<void>;
  updateBranch: (id: string, data: Partial<Branch>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  getBranchById: (id: string) => Promise<Branch | null>;
}

export const useBranchesStore = create<BranchesState>((set, get) => ({
  branches: [],
  isLoading: false,
  error: null,

  fetchBranches: async (companyId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/branches', {
        params: companyId ? { companyId } : {}
      });
      set({ branches: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al cargar sucursales';
      set({ error: message, isLoading: false });
    }
  },

  createBranch: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/branches', data);
      await get().fetchBranches(data.companyId);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al crear sucursal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateBranch: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/branches/${id}`, data);
      await get().fetchBranches(data.companyId);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al actualizar sucursal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteBranch: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/branches/${id}`);
      await get().fetchBranches();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al eliminar sucursal';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getBranchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/branches/${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al cargar sucursal';
      set({ error: message, isLoading: false });
      return null;
    }
  },
}));
