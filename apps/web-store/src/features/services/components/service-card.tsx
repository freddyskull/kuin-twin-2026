"use client";

import { ServiceDto } from 'shared-types';
import { ServiceCard as SharedServiceCard } from 'ui-components';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  service: ServiceDto;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <SharedServiceCard
      service={service as any}
      LinkComponent={Link}
      ImageComponent={Image}
    />
  );
};
