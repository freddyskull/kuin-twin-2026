import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Building2, CheckCircle, XCircle, Store } from 'lucide-react';
import { useCompanies, useDeleteCompany } from './companies.hooks';
import type { Company } from '../../stores/companies.store';
import { getAbsoluteUrl, ResourceTable, useQueryState, useQueryPagination } from 'ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Modal } from '../../components/Modal';
import { BranchList } from './components/branch-list';

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: companies = [], isLoading, error } = useCompanies();
  const deleteMutation = useDeleteCompany();
  
  // URL-Synced state
  const [filter, setFilter] = useQueryState<'all' | 'verified' | 'unverified'>('filter', 'all');
  const [page, setPage] = useQueryPagination();
  const [searchTerm, setSearchTerm] = useQueryState('search', '');
  
  const pageSize = 10;

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

  const { filteredCompanies, paginatedCompanies, totalPages, total } = useMemo(() => {
    const filtered = companies.filter(c => {
      const matchesFilter = filter === 'all' ||
        (filter === 'verified' ? c.isSatVerified : !c.isSatVerified);
      
      const matchesSearch = searchTerm === '' || 
        c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rfc.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
    
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    
    return { filteredCompanies: filtered, paginatedCompanies: paginated, totalPages, total };
  }, [companies, filter, page, searchTerm]);

  const handleFilterChange = (f: 'all' | 'verified' | 'unverified') => {
    setFilter(f);
  };

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
                <img src={getAbsoluteUrl(company.logoUrl) || ''} alt={company.businessName} className="h-full w-full object-cover" />
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
    <>
      <ResourceTable<Company>
        title="Empresas"
        subtitle="Gestiona tus empresas registradas y sus sucursales."
        total={total}
        isLoading={isLoading}
        columns={columns}
        data={paginatedCompanies}
        emptyMessage="No se encontraron empresas."
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Buscar por nombre o RFC..."
        }}
        createButton={{
          label: "Nueva Empresa",
          onClick: () => navigate('/empresas/crear')
        }}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage
        }}
        filters={
          (['all', 'verified', 'unverified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider whitespace-nowrap ${filter === f
                ? 'bg-background text-primary shadow-sm border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {f === 'all' ? 'Todas' : f === 'verified' ? 'Verificadas' : f === 'unverified' ? 'Pendientes' : ''}
            </button>
          ))
        }
      />

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
    </>
  );
};
