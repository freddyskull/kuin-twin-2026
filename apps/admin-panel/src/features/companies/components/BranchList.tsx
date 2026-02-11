import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Phone, Mail, Trash2, Pencil, CheckCircle, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBranchesStore } from '../../../stores/branches.store';
import type { Branch } from '../../../stores/branches.store';
import { Modal } from '../../../components/Modal';
import { BranchForm } from './BranchForm';

interface BranchListProps {
  companyId: string;
}

export const BranchList: React.FC<BranchListProps> = ({ companyId }) => {
  const { branches, fetchBranches, createBranch, updateBranch, deleteBranch, isLoading } = useBranchesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  useEffect(() => {
    fetchBranches(companyId);
  }, [companyId, fetchBranches]);

  const handleCreate = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, data);
      } else {
        await createBranch({ ...data, companyId });
      }
      setIsModalOpen(false);
      fetchBranches(companyId);
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la sucursal "${name}"?`)) {
      await deleteBranch(id);
      fetchBranches(companyId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 text-dashboard-primary" />
          <h2 className="text-2xl font-bold text-white">Sucursales</h2>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-dashboard-primary/10 text-dashboard-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-dashboard-primary hover:text-dashboard-bg transition-all"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Nueva Sucursal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {branches.map((branch) => (
            <motion.div
              key={branch.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0b1e]/40 border border-white/5 rounded-3xl p-6 hover:border-dashboard-primary/30 transition-all relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                  {branch.isMain && (
                    <span className="px-2 py-0.5 rounded-full bg-dashboard-primary/20 text-dashboard-primary text-[10px] font-black uppercase tracking-wider">
                      Principal
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(branch)}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id, branch.name)}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-slate-400 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{branch.address}, {branch.city}, {branch.state} CP {branch.zipCode}</span>
                </div>
                {(branch.phone || branch.whatsapp) && (
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{branch.phone || branch.whatsapp}</span>
                  </div>
                )}
                {branch.email && (
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{branch.email}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {branches.length === 0 && !isLoading && (
          <div className="col-span-2 py-12 text-center bg-[#0a0b1e]/20 border border-dashed border-white/10 rounded-3xl">
            <Store className="h-12 w-12 text-slate-600 mx-auto mb-4 opacity-20" />
            <p className="text-slate-500 font-medium">No hay sucursales registradas para esta empresa.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
      >
        <BranchForm
          initialData={editingBranch || undefined}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};
