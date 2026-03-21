import React, { useState, useMemo } from 'react';
import { Plus, MapPin, Phone, Mail, Trash2, Pencil, Store } from 'lucide-react';
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from '../branches.hooks';
import type { Branch } from '../../../stores/branches.store';
import { Modal } from '../../../components/Modal';
import { BranchForm } from './branch-form';
import { ResourceTable, useQueryState, useQueryPagination } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';

interface BranchListProps {
  companyId: string;
}

export const BranchList: React.FC<BranchListProps> = ({ companyId }) => {
  const { data: branches = [], isLoading } = useBranches(companyId);
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch(companyId);

  // URL-Synced state for branches (using specific keys to avoid conflict with CompaniesPage)
  const [searchTerm, setSearchTerm] = useQueryState('branchSearch', '');
  const [page, setPage] = useQueryPagination('branchPage');
  const pageSize = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

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
        await updateMutation.mutateAsync({ id: editingBranch.id, data });
      } else {
        await createMutation.mutateAsync({ ...data, companyId });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la sucursal "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error al eliminar sucursal:', err);
      }
    }
  };

  const { paginatedBranches, totalPages, total } = useMemo(() => {
    const filtered = branches.filter(b => 
      searchTerm === '' || 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    
    return { paginatedBranches: paginated, totalPages, total };
  }, [branches, searchTerm, page]);

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: 'name',
      header: 'Sucursal',
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs">{branch.name}</span>
            {branch.isMain && (
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black uppercase tracking-wider">
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
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate max-w-[180px]">{branch.address}, {branch.city}</span>
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
              <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                <Phone className="h-2.5 w-2.5" />
                <span>{branch.phone}</span>
              </div>
            )}
            {branch.email && (
              <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                <Mail className="h-2.5 w-2.5" />
                <span className="truncate max-w-[120px]">{branch.email}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => handleEdit(branch)}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-primary transition-all"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(branch.id, branch.name)}
              disabled={deleteMutation.isPending}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-red-500 transition-all disabled:opacity-30"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-0">
      <ResourceTable<Branch>
        title="Sucursales"
        hideTitle={true}
        total={total}
        isLoading={isLoading}
        columns={columns}
        data={paginatedBranches}
        emptyMessage="No hay sucursales registradas."
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Buscar sucursal..."
        }}
        createButton={{
          label: "Nueva Sucursal",
          onClick: handleCreate
        }}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
      >
        <BranchForm
          initialData={editingBranch || undefined}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};
