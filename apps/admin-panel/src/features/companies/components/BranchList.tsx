import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Phone, Mail, Trash2, Pencil, Store } from 'lucide-react';
import { useBranchesStore } from '../../../stores/branches.store';
import type { Branch } from '../../../stores/branches.store';
import { Modal } from '../../../components/Modal';
import { BranchForm } from './BranchForm';
import { DataTable } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';

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

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: 'name',
      header: 'Sucursal',
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{branch.name}</span>
            {branch.isMain && (
              <span className="px-2 py-0.5 rounded-full bg-dashboard-primary/20 text-dashboard-primary text-[9px] font-black uppercase tracking-wider">
                Principal
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'address',
      header: 'Ubicación',
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate max-w-[200px]">{branch.address}, {branch.city}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Contacto',
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="space-y-1">
            {branch.phone && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Phone className="h-3 w-3" />
                <span>{branch.phone}</span>
              </div>
            )}
            {branch.email && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Mail className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{branch.email}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex items-center gap-2">
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
        );
      },
    },
  ];

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

      <div className="bg-[#0a0b1e]/40 border border-white/5 rounded-3xl overflow-hidden">
        <DataTable
          columns={columns}
          data={branches}
          isLoading={isLoading}
          emptyMessage="No hay sucursales registradas para esta empresa."
          className="border-none"
        />
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
