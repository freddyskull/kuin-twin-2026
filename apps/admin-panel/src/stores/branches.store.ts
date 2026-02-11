import { create } from 'zustand';

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
      const url = companyId 
        ? `http://localhost:3001/branches?companyId=${companyId}`
        : 'http://localhost:3001/branches';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar sucursales');
      const data = await response.json();
      set({ branches: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createBranch: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:3001/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear sucursal');
      await get().fetchBranches(data.companyId);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateBranch: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/branches/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar sucursal');
      await get().fetchBranches();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteBranch: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/branches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al eliminar sucursal');
      await get().fetchBranches();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  getBranchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3001/branches/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al cargar sucursal');
      const data = await response.json();
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },
}));
