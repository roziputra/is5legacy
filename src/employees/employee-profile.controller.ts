import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EmployeesService } from './employees.service';
import { CurrentUser } from './current-user.decorator';
import { Employee } from './employee.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/employees/profile')
export class EmployeeProfileController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@CurrentUser() user): Promise<Employee> {
    return this.employeesService.getProfile(user);
  }
}
