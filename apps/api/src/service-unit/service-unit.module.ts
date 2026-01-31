import { Module } from '@nestjs/common';
import { ServiceUnitService } from './service-unit.service';
import { ServiceUnitController } from './service-unit.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceUnitController],
  providers: [ServiceUnitService],
  exports: [ServiceUnitService],
})
export class ServiceUnitModule {}
