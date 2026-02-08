import React, { useState, useEffect } from 'react';
import {
  Info,
  ChevronDown,
  Image as ImageIcon,
  Lightbulb,
  ArrowRight,
  Plus,
  Star,
  DollarSign,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useServicesStore } from '../../stores/services.store';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from '@tanstack/react-router';

const serviceSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  basePrice: z.coerce.number().min(1, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  unitId: z.string().min(1, 'Unit is required'),
  tier: z.enum(['Elite', 'Standard']).default('Elite'),
  location: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export const CreateServicePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { categories, units, fetchMetadata, createService } = useServicesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      tier: 'Elite',
      categoryId: '',
      unitId: ''
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // Sync unitId and categoryId if empty and metadata loaded
  useEffect(() => {
    if (categories.length > 0 && !watchedValues.categoryId) {
      setValue('categoryId', categories[0].id);
    }
    if (units.length > 0 && !watchedValues.unitId) {
      setValue('unitId', units[0].id);
    }
  }, [categories, units, setValue, watchedValues.categoryId, watchedValues.unitId]);

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.id) {
      console.error('No user found in auth store');
      return;
    }

    try {
      const payload = {
        vendorId: user.id,
        categoryId: data.categoryId,
        unitId: data.unitId,
        title: data.title,
        description: data.description,
        basePrice: data.basePrice,
        isActive: true,
        dynamicAttributes: {
          tier: data.tier,
          location: data.location
        }
      };

      await createService(payload);
      navigate({ to: '/services' });
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  const steps = [
    { id: 1, label: 'BASIC INFO' },
    { id: 2, label: 'PRICING' },
    { id: 3, label: 'MEDIA' },
    { id: 4, label: 'LOCATION' },
  ];

  const handleNext = async () => {
    let fieldsToValidate: (keyof ServiceFormValues)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['title', 'description', 'categoryId', 'tier'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['basePrice', 'unitId'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter">Create New Service</h1>
          <p className="text-slate-400 font-medium max-w-2xl text-lg">
            List your bespoke luxury offering to a global audience of high-net-worth clients.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: '/services' })}
          className="bg-white/5 border border-white/10 text-slate-400 px-8 py-4 rounded-2xl font-black hover:bg-white/10 transition-all text-sm tracking-widest uppercase"
        >
          Discard Draft
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between max-w-4xl mx-auto py-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0" />

        {steps.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 ${currentStep >= step.id
              ? 'bg-dashboard-primary text-dashboard-bg shadow-[0_0_20px_rgba(245,192,106,0.4)]'
              : 'bg-[#11122d] text-slate-600 border border-white/10'
              }`}>
              {step.id}
            </div>
            <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${currentStep >= step.id ? 'text-dashboard-primary text-shadow-gold' : 'text-slate-600'
              }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-12">
        {/* Left Column: Form Sections */}
        <div className="col-span-8 space-y-12">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.section
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-dashboard-primary/20 p-2 rounded-lg">
                    <Info className="h-6 w-6 text-dashboard-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Service Details</h2>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Service Title</label>
                    <input
                      {...register('title')}
                      placeholder="e.g. Private Amalfi Coast Helicopter Charter"
                      className="w-full bg-transparent border-b-2 border-white/10 py-6 text-2xl text-white font-medium focus:outline-none focus:border-dashboard-primary transition-all placeholder:text-slate-700"
                    />
                    {errors.title && <p className="text-red-500 text-xs font-bold pl-1">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Category</label>
                      <div className="relative group">
                        <select
                          {...register('categoryId')}
                          className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all cursor-pointer"
                        >
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          {categories.length === 0 && <option value="">Loading categories...</option>}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Service Tier</label>
                      <div className="flex bg-[#0a0b1e]/40 p-1.5 rounded-2xl border border-white/5 h-16">
                        <button
                          type="button"
                          onClick={() => setValue('tier', 'Elite')}
                          className={`flex-1 rounded-xl font-black text-sm transition-all ${watchedValues.tier === 'Elite'
                            ? 'bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/30 shadow-[0_0_15px_rgba(245,192,106,0.1)]'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                          Elite
                        </button>
                        <button
                          type="button"
                          onClick={() => setValue('tier', 'Standard')}
                          className={`flex-1 rounded-xl font-black text-sm transition-all ${watchedValues.tier === 'Standard'
                            ? 'bg-dashboard-primary/10 text-dashboard-primary border border-dashboard-primary/30'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                          Standard
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Description</label>
                    <div className="relative">
                      <textarea
                        {...register('description')}
                        rows={8}
                        placeholder="Describe the exclusive experience your service provides..."
                        className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-3xl py-6 px-8 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all resize-none placeholder:text-slate-700"
                      />
                      <div className="absolute bottom-6 right-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        Recommended: 200-500 words
                      </div>
                    </div>
                    {errors.description && <p className="text-red-500 text-xs font-bold pl-1">{errors.description.message}</p>}
                  </div>
                </div>
              </motion.section>
            )}

            {currentStep === 2 && (
              <motion.section
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-dashboard-primary/20 p-2 rounded-lg">
                    <DollarSign className="h-6 w-6 text-dashboard-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Pricing Configuration</h2>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Base Price ($)</label>
                    <input
                      {...register('basePrice')}
                      type="number"
                      step="0.01"
                      className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-2xl py-4 px-6 text-2xl text-white font-black focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Service Unit</label>
                    <div className="relative group">
                      <select
                        {...register('unitId')}
                        className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all cursor-pointer"
                      >
                        {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>)}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {currentStep === 3 && (
              <motion.section
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 space-y-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-dashboard-primary/20 p-2 rounded-lg">
                      <ImageIcon className="h-6 w-6 text-dashboard-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Media Gallery</h2>
                  </div>
                </div>
                <div className="border-2 border-dashed border-white/5 rounded-[2.5rem] h-80 flex flex-col items-center justify-center gap-4 group hover:border-dashboard-primary/30 transition-all cursor-pointer bg-[#0a0b1e]/20">
                  <div className="h-20 w-20 rounded-3xl bg-[#1a1c3d] flex items-center justify-center text-slate-600 group-hover:text-dashboard-primary group-hover:scale-110 transition-all duration-500">
                    <Plus className="h-8 w-8" />
                  </div>
                  <p className="text-slate-500 font-bold text-lg">Click or drag images to upload</p>
                </div>
              </motion.section>
            )}

            {currentStep === 4 && (
              <motion.section
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-dashboard-primary/20 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-dashboard-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Location Details</h2>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] pl-1">Primary Location / Coverage Area</label>
                  <input
                    {...register('location')}
                    placeholder="e.g. Amalfi Coast, Italy"
                    className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-2xl py-6 px-8 text-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all"
                  />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-6 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-10 py-5 rounded-[2rem] border border-white/5 text-slate-500 font-black tracking-widest uppercase hover:bg-white/5 transition-all disabled:opacity-0"
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-4 bg-dashboard-primary text-dashboard-bg px-10 py-5 rounded-[2rem] font-black shadow-2xl shadow-dashboard-primary/20 hover:scale-105 active:scale-95 transition-all group"
              >
                Continue
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-4 bg-dashboard-primary text-dashboard-bg px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-dashboard-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creating listing...' : 'Create Service Listing'}
                <Star className="h-6 w-6 fill-dashboard-bg" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Previews & Tips */}
        <div className="col-span-4 space-y-10">
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] pl-2">Service Preview</h3>
            <div className="bg-[#0a0b1e] border border-white/10 rounded-[2.5rem] overflow-hidden group shadow-2xl">
              <div className="h-72 bg-[#1a1c3d] relative">
                <div className="absolute top-6 left-6 bg-dashboard-primary text-dashboard-bg text-[10px] font-black px-3 py-1.5 rounded-lg tracking-widest uppercase">New Listing</div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white leading-tight">
                    {watchedValues.title || 'Service Title Preview'}
                  </h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {categories.find(c => c.id === watchedValues.categoryId)?.name || 'Category'} • {watchedValues.tier} Service
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-dashboard-primary">
                      ${watchedValues.basePrice ? Number(watchedValues.basePrice).toLocaleString() : '0'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      / {units.find(u => u.id === watchedValues.unitId)?.abbreviation || 'UNIT'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-dashboard-primary">
                    <Star className="h-4 w-4 fill-dashboard-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">New</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1c3d] to-[#0a0b10] border border-white/5 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group shadow-xl">
            <div className="flex items-center gap-4 text-dashboard-primary">
              <Lightbulb className="h-6 w-6" />
              <span className="font-black text-[11px] uppercase tracking-[0.3em]">Listing Tip</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {currentStep === 1 && "Start with a compelling title that captures the luxury essence of your service."}
              {currentStep === 2 && "Competitive pricing in the luxury market depends on exclusivity and unit clarity."}
              {currentStep === 3 && "High-quality photography increases conversion rates for luxury services by up to 85%."}
              {currentStep === 4 && "Clearly defining your coverage area helps match you with the right local elite clients."}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
