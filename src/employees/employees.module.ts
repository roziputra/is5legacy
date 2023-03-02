import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeProfileController } from './employee-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService],
  controllers: [EmployeesController, EmployeeProfileController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
