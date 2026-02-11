import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Building2, CheckCircle, XCircle, Store } from 'lucide-react';
import { useCompanies, useDeleteCompany } from './companies.hooks';
import type { Company } from '../../stores/companies.store';
import { DataTable } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Modal } from '../../components/Modal';
import { BranchList } from './components/BranchList';

export const CompaniesPage: React.FC = () => {
  const { data: companies = [], isLoading, error } = useCompanies();
  const deleteMutation = useDeleteCompany();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Estado para el modal de sucursales desde la tabla
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la empresa "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Error al eliminar empresa:', err);
      }
    }
  };

  const handleManageBranches = (id: string, name: string) => {
    setSelectedCompany({ id, name });
    setIsBranchModalOpen(true);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesFilter = filter === 'all' ||
        (filter === 'verified' ? c.isSatVerified : !c.isSatVerified);
      const matchesSearch = c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.rfc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [companies, filter, searchQuery]);

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'businessName',
      header: 'Empresa',
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#0a0b1e] overflow-hidden flex items-center justify-center border border-white/5 flex-shrink-0">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.businessName} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-5 w-5 text-slate-600" />
              )}
            </div>
            <div>
              <div className="font-bold text-white">{company.businessName}</div>
              <div className="text-xs text-slate-500">{company.rfc}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'isSatVerified',
      header: 'Estado SAT',
      cell: ({ row }) => {
        const isVerified = row.getValue('isSatVerified') as boolean;
        return isVerified ? (
          <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase w-fit">
            <CheckCircle className="h-3 w-3" />
            Verificada
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase w-fit">
            <XCircle className="h-3 w-3" />
            Pendiente
          </div>
        );
      },
    },
    {
      accessorKey: '_count.branches',
      header: 'Sucursales',
      cell: ({ row }) => (
        <div className="font-bold text-slate-300">
          {row.original._count?.branches || 0}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleManageBranches(company.id, company.businessName)}
              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all"
              title="Gestionar Sucursales"
              type="button"
            >
              <Store className="h-4 w-4" />
            </button>
            <Link to={`/companies/${company.id}/edit`}>
              <button
                type="button"
                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all"
                title="Editar Empresa"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(company.id, company.businessName)}
              disabled={deleteMutation.isPending}
              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-30"
              title="Eliminar Empresa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Empresas</h1>
          <p className="text-slate-400 font-medium">Gestiona las empresas registradas y su verificación SAT.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o RFC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1c3d]/60 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 w-80 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/companies/create">
            <button className="flex items-center gap-3 bg-dashboard-primary text-dashboard-bg px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-dashboard-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="h-5 w-5 stroke-[3]" />
              Registrar Nueva Empresa
            </button>
          </Link>

          <div className="flex bg-[#1a1c3d]/60 p-1.5 rounded-2xl border border-white/5">
            {(['all', 'verified', 'unverified'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${filter === f
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                {f === 'all' ? 'Todas' : f === 'verified' ? 'Verificadas' : 'Sin Verificar'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl font-bold text-sm">
          Error: {(error as Error).message}
        </div>
      )}

      <div className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredCompanies}
          isLoading={isLoading}
          emptyMessage="No se encontraron empresas con los criterios seleccionados."
          className="border-none"
        />
      </div>

      {/* Modal para gestionar sucursales */}
      <Modal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        title={`Sucursales: ${selectedCompany?.name || ''}`}
        size="lg"
      >
        {selectedCompany && (
          <BranchList companyId={selectedCompany.id} />
        )}
      </Modal>
    </div>
  );
};
