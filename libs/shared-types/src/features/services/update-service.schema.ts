import { CreateServiceBaseSchema } from './create-service.schema';

export const UpdateServiceSchema = CreateServiceBaseSchema.partial();

export type UpdateServiceDto = typeof UpdateServiceSchema._type;
