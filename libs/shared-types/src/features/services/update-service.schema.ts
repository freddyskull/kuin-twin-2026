import { CreateServiceSchema } from './create-service.schema';

export const UpdateServiceSchema = CreateServiceSchema.partial();

export type UpdateServiceDto = typeof UpdateServiceSchema._type;
