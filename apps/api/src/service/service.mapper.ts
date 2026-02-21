import { CreateServiceDto, UpdateServiceDto } from './dto';

export function mapCreateServiceData(createDto: CreateServiceDto, slug: string) {
  const { 
    vendorId, categoryId, unitId, companyId, 
    metadata, slots, workSchedule, tags, 
    dynamicAttributes, commentsBox,
    branchIds, // Excluir porque no existe en Prisma aún
    ...rest 
  } = createDto;

  return {
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
  };
}

export function mapUpdateServiceData(updateDto: UpdateServiceDto) {
  const { 
    metadata, slots, workSchedule, companyId, 
    tags, dynamicAttributes, commentsBox,
    branchIds, // Excluir porque no existe en Prisma aún
    ...rest 
  } = updateDto;

  const data: any = { ...rest };
  
  if (tags !== undefined) data.tags = tags;
  if (companyId !== undefined) data.companyId = companyId;
  if (workSchedule !== undefined) data.workSchedule = workSchedule ?? undefined;
  if (dynamicAttributes !== undefined) data.dynamicAttributes = dynamicAttributes ?? undefined;
  if (commentsBox !== undefined) data.commentsBox = commentsBox ?? undefined;

  return data;
}
