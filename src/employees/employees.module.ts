import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeProfileController } from './employee-profile.controller';
import { EmployeeRepository } from './repositories/employee.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService, EmployeeRepository],
  controllers: [EmployeesController, EmployeeProfileController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
