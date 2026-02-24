import { createZodDto } from 'nestjs-zod';
import { CreateReviewSchema } from 'shared-types';

export class CreateReviewDto extends createZodDto(CreateReviewSchema) {}
