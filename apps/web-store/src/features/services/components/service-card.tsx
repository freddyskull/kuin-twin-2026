"use client";

import { ServiceDto } from 'shared-types';
import { ServiceCard as SharedServiceCard } from 'ui-components';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  service: ServiceDto;
  currentUserId?: string;
  onEdit?: (service: any) => void;
  onDelete?: (service: any) => void;
}

export const ServiceCard = ({ service, currentUserId, onEdit, onDelete }: ServiceCardProps) => {
  return (
    <SharedServiceCard
      service={service as any}
      LinkComponent={Link}
      ImageComponent={Image}
      currentUserId={currentUserId}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
