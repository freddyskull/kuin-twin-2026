import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Building2, FileText, MapPin, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompaniesStore } from '../../stores/companies.store';

export const CreateCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { createCompany, isLoading } = useCompaniesStore();

  const [formData, setFormData] = useState({
    businessName: '',
    logoUrl: '',
    description: '',
    rfc: '',
    legalName: '',
    fiscalRegime: '',
    taxAddress: '',
    taxAddressZip: '',
    taxAddressCity: '',
    taxAddressState: '',
    taxAddressCounty: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany(formData);
      navigate({ to: '/companies' });
    } catch (error) {
      console.error('Error al crear empresa:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Registrar Nueva Empresa</h1>
        <p className="text-slate-400 font-medium">Completa la información fiscal y comercial de la empresa.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información Comercial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-6 w-6 text-dashboard-primary" />
            <h2 className="text-2xl font-bold text-white">Información Comercial</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Nombre Comercial *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Ej: Servicios Profesionales SA"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                URL del Logo
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Breve descripción de la empresa..."
              />
            </div>
          </div>
        </motion.div>

        {/* Información Fiscal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-dashboard-primary" />
            <h2 className="text-2xl font-bold text-white">Datos Fiscales (SAT)</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                RFC *
              </label>
              <input
                type="text"
                name="rfc"
                value={formData.rfc}
                onChange={handleChange}
                required
                maxLength={13}
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 uppercase"
                placeholder="ABC123456XYZ"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Régimen Fiscal *
              </label>
              <select
                name="fiscalRegime"
                value={formData.fiscalRegime}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
              >
                <option value="">Seleccionar...</option>
                <option value="601">601 - General de Ley Personas Morales</option>
                <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                <option value="606">606 - Arrendamiento</option>
                <option value="612">612 - Personas Físicas con Actividades Empresariales</option>
                <option value="621">621 - Régimen de Incorporación Fiscal</option>
                <option value="625">625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas</option>
                <option value="626">626 - Régimen Simplificado de Confianza</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Razón Social *
              </label>
              <input
                type="text"
                name="legalName"
                value={formData.legalName}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Nombre legal completo de la empresa"
              />
            </div>
          </div>
        </motion.div>

        {/* Domicilio Fiscal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-dashboard-primary" />
            <h2 className="text-2xl font-bold text-white">Domicilio Fiscal</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                name="taxAddress"
                value={formData.taxAddress}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Calle, número exterior e interior"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                name="taxAddressCity"
                value={formData.taxAddressCity}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Ciudad"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Estado *
              </label>
              <input
                type="text"
                name="taxAddressState"
                value={formData.taxAddressState}
                onChange={handleChange}
                required
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Estado"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Municipio/Delegación
              </label>
              <input
                type="text"
                name="taxAddressCounty"
                value={formData.taxAddressCounty}
                onChange={handleChange}
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="Municipio o Delegación"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Código Postal *
              </label>
              <input
                type="text"
                name="taxAddressZip"
                value={formData.taxAddressZip}
                onChange={handleChange}
                required
                maxLength={5}
                className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
                placeholder="00000"
              />
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate({ to: '/companies' })}
            className="px-8 py-3.5 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 rounded-2xl bg-dashboard-primary text-dashboard-bg font-black shadow-xl shadow-dashboard-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Registrar Empresa'}
          </button>
        </div>
      </form>
    </div>
  );
};
