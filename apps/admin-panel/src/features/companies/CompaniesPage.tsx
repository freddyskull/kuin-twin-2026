import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Plus, Search, Pencil, Trash2, Building2, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompaniesStore } from '../../stores/companies.store';

export const CompaniesPage: React.FC = () => {
  const { companies, fetchCompanies, deleteCompany, error, isLoading } = useCompaniesStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'verified' | 'unverified'>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la empresa "${name}"?`)) {
      await deleteCompany(id);
    }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesFilter = filter === 'all' ||
      (filter === 'verified' ? c.isSatVerified : !c.isSatVerified);
    const matchesSearch = c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.rfc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
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
          <div className="flex p-[2px] bg-gradient-to-br from-[#1a1c3d] to-dashboard-primary/20 rounded-full h-12 w-12">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre" className="rounded-full bg-dashboard-sidebar" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
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

        <div className="text-slate-400 font-bold text-sm">
          Total: <span className="text-white ml-1">{filteredCompanies.length}</span> Empresas
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl font-bold text-sm animate-in slide-in-from-top-4 duration-300">
          Error: {error}
        </div>
      )}

      {/* Companies List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {paginatedCompanies.map((company) => (
            <motion.div
              key={company.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center justify-between p-8 rounded-[2.5rem] bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 hover:border-dashboard-primary/30 transition-all"
            >
              <div className="flex items-center gap-8 flex-1">
                <div className="h-24 w-24 rounded-3xl bg-[#0a0b1e] overflow-hidden flex items-center justify-center border border-white/5">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.businessName} className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-12 w-12 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{company.businessName}</h3>
                    {company.isSatVerified ? (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-green-500/20 text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        Verificada SAT
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-yellow-500/20 text-yellow-500">
                        <XCircle className="h-3 w-3" />
                        Sin Verificar
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-2">
                    RFC: <span className="text-slate-300 font-bold">{company.rfc}</span>
                  </p>
                  <p className="text-slate-500 text-xs font-medium line-clamp-1">
                    {company.legalName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12 pl-12">
                <div className="text-right">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Sucursales</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{company._count?.branches || 0}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/companies/${company.id}/edit`}>
                    <button className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-dashboard-primary hover:bg-dashboard-primary/10 transition-all active:scale-90">
                      <Pencil className="h-5 w-5" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(company.id, company.businessName)}
                    disabled={isLoading}
                    className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 pb-12">
          <div className="flex items-center gap-2 bg-[#1a1c3d]/60 p-2 rounded-2xl border border-white/5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 text-slate-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 font-bold rounded-xl transition-all ${currentPage === i + 1
                  ? 'bg-dashboard-primary text-dashboard-bg font-black'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 text-slate-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
