import { CreateServiceDto, UpdateServiceDto } from './dto';

export function mapCreateServiceData(createDto: CreateServiceDto, slug: string) {
  const { 
    vendorId, categoryId, unitId, companyId, 
    metadata, faqs, slots, workSchedule, tags, 
    dynamicAttributes, commentsBox,
    branchIds, latitude, longitude, address,
    ...rest 
  } = createDto;

  const data: any = {
    ...rest,
    slug,
    vendorId,
    categoryId,
    unitId: unitId || null,
    companyId: companyId || null,
    tags: tags || [],
    dynamicAttributes: dynamicAttributes ?? undefined,
    workSchedule: workSchedule ?? undefined,
    commentsBox: commentsBox ?? undefined,
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

export function mapUpdateServiceData(updateDto: UpdateServiceDto) {
  const { 
    metadata, faqs, slots, workSchedule, companyId, 
    tags, dynamicAttributes, commentsBox,
    branchIds, latitude, longitude, address,
    ...rest 
  } = updateDto;

  const data: any = { ...rest };
  
  if (tags !== undefined) data.tags = tags;
  if (companyId !== undefined) data.companyId = companyId;
  if (workSchedule !== undefined) data.workSchedule = workSchedule ?? undefined;
  if (dynamicAttributes !== undefined) data.dynamicAttributes = dynamicAttributes ?? undefined;
  if (commentsBox !== undefined) data.commentsBox = commentsBox ?? undefined;
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
