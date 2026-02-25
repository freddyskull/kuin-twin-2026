'use client';

import React from 'react';
import Image from 'next/image';
import { getAbsoluteUrl } from '@/lib/utils';
import { Card } from '@/components/ui';
import { MessageCircle } from 'lucide-react';
import { StatusIndicator } from '@/features/chat/components';
import Link from 'next/link';

interface FloatingVendorBadgeProps {
  vendor: {
    id: string;
    profile?: {
      displayName: string;
      avatarUrl?: string | null;
    } | null;
  };
  serviceId: string;
}

export const FloatingVendorBadge: React.FC<FloatingVendorBadgeProps> = ({ vendor, serviceId }) => {
  const avatarUrl = getAbsoluteUrl(vendor.profile?.avatarUrl);

  return (
    <div className="fixed bottom-10 left-8 z-50 group">
      <Link href={`/chat/new?vendorId=${vendor.id}&serviceId=${serviceId}`}>
        <div className="flex items-center p-1.5 pr-5 rounded-full bg-background/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-primary/25 hover:border-primary/40 transition-all duration-500 ease-out hover:-translate-y-1 active:scale-95 ring-1 ring-black/5">

          {/* Avatar Area with Status Indicator */}
          <div className="relative">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-background shadow-inner bg-secondary/30 flex items-center justify-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={vendor.profile?.displayName || 'Vendor'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <span className="font-black text-xs text-primary/80">
                  {vendor.profile?.displayName?.charAt(0).toUpperCase() || 'P'}
                </span>
              )}
            </div>

            {/* Status dot position adjusted to look more integrated */}
            <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
              <StatusIndicator userId={vendor.id} />
            </div>
          </div>

          <div className="flex flex-col ml-3 mr-4">
            <span className="text-[13px] font-black text-foreground tracking-tight leading-none mb-1">
              {vendor.profile?.displayName || 'Profesional'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground/90 font-bold uppercase tracking-tighter">
                Responde en <span className="text-primary font-black">~15m</span>
              </span>
            </div>
          </div>

          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
            <MessageCircle className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Floating Mini-label */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-90 group-hover:scale-100">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 backdrop-blur-md">
          Chat Directo
        </span>
      </div>
    </div>
  );
};
