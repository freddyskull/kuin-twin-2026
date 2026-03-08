import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Building2, CheckCircle, XCircle, Store } from 'lucide-react';
import { useCompanies, useDeleteCompany } from './companies.hooks';
import type { Company } from '../../stores/companies.store';
import { Button, DataTable } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Modal } from '../../components/modal';
import { BranchList } from './components/branch-list';

export const CompaniesPage: React.FC = () => {
  const { data: companies = [], isLoading, error } = useCompanies();
  const deleteMutation = useDeleteCompany();
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
      return matchesFilter;
    });
  }, [companies, filter]);

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: 'businessName',
      header: 'Empresa',
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden flex items-center justify-center border border-border flex-shrink-0">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.businessName} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-foreground text-xs truncate">{company.businessName}</div>
              <div className="text-[10px] text-muted-foreground font-medium">{company.rfc}</div>
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
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-500/20 w-fit">
            <CheckCircle className="h-3 w-3" />
            Verificada
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-amber-500/20 w-fit">
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
        <div className="font-bold text-foreground text-xs px-2">
          {row.original._count?.branches || 0}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleManageBranches(company.id, company.businessName)}
              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/20"
              title="Sucursales"
              type="button"
            >
              <Store className="h-3.5 w-3.5" />
            </button>
            <Link to={`/empresas/${company.id}/editar`}>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-all"
                title="Editar"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(company.id, company.businessName)}
              disabled={deleteMutation.isPending}
              className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-destructive transition-all disabled:opacity-20"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto pb-10 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Empresas</h1>
          <p className="text-muted-foreground text-xs md:text-sm">Gestiona tus empresas registradas y sus sucursales.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border overflow-x-auto no-scrollbar">
            {(['all', 'verified', 'unverified'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider whitespace-nowrap ${filter === f
                  ? 'bg-background text-primary shadow-sm border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {f === 'all' ? 'Todas' : f === 'verified' ? 'Verificadas' : 'Pendientes'}
              </button>
            ))}
          </div>
          
          <Link to="/empresas/crear" className="flex">
            <Button className="flex-1 h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Empresa
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Error: {(error as Error).message}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[800px]">
            <DataTable
              columns={columns}
              data={filteredCompanies}
              isLoading={isLoading}
              emptyMessage="No se encontraron empresas."
              className="border-none"
            />
          </div>
        </div>
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
