import { Prisma } from '@prisma/client';
import { CreateServiceDto, UpdateServiceDto } from './dto';

export function mapCreateServiceData(createDto: CreateServiceDto, slug: string): Prisma.ServiceCreateInput {
  const { 
    vendorId, categoryId, unitId, companyId, 
    metadata, faqs, slots, workSchedule, tags, 
    dynamicAttributes, commentsBox,
    branchIds, latitude, longitude, address,
    ...rest 
  } = createDto;

  const data: Prisma.ServiceCreateInput = {
    ...rest,
    slug,
    title: createDto.title,
    vendor: { connect: { id: vendorId } },
    category: { connect: { id: categoryId } },
    unit: unitId ? { connect: { id: unitId } } : undefined,
    company: companyId ? { connect: { id: companyId } } : undefined,
    tags: tags || [],
    dynamicAttributes: dynamicAttributes as Prisma.InputJsonValue ?? Prisma.JsonNull,
    workSchedule: workSchedule as Prisma.InputJsonValue ?? Prisma.JsonNull,
    commentsBox: commentsBox as Prisma.InputJsonValue ?? Prisma.JsonNull,
    latitude,
    longitude,
    address,
  };

  if (branchIds && branchIds.length > 0) {
    data.branches = {
      connect: branchIds.map(id => ({ id }))
    };
  }

  return data;
}

export function mapUpdateServiceData(updateDto: UpdateServiceDto): Prisma.ServiceUpdateInput {
  const { 
    metadata, faqs, slots, workSchedule, companyId, 
    tags, dynamicAttributes, commentsBox,
    branchIds, latitude, longitude, address,
    categoryId, unitId,
    ...rest 
  } = updateDto;

  const data: Prisma.ServiceUpdateInput = { 
    ...rest,
    title: updateDto.title ?? undefined,
  };
  
  if (tags !== undefined) data.tags = tags;
  
  if (categoryId !== undefined) {
    data.category = { connect: { id: categoryId } };
  }
  
  if (unitId !== undefined) {
    data.unit = unitId ? { connect: { id: unitId } } : { disconnect: true };
  }

  if (companyId !== undefined) {
    data.company = companyId ? { connect: { id: companyId } } : { disconnect: true };
  }
  if (workSchedule !== undefined) {
    data.workSchedule = workSchedule as Prisma.InputJsonValue ?? Prisma.JsonNull;
  }
  if (dynamicAttributes !== undefined) {
    data.dynamicAttributes = dynamicAttributes as Prisma.InputJsonValue ?? Prisma.JsonNull;
  }
  if (commentsBox !== undefined) {
    data.commentsBox = commentsBox as Prisma.InputJsonValue ?? Prisma.JsonNull;
  }
  if (latitude !== undefined) data.latitude = latitude;
  if (longitude !== undefined) data.longitude = longitude;
  if (address !== undefined) data.address = address;

  if (branchIds !== undefined) {
    data.branches = {
      set: branchIds.map(id => ({ id }))
    };
  }

  return data;
}
