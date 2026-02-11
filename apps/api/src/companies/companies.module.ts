import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { SatService } from './sat.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, SatService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
