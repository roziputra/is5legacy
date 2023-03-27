import {
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
import { EmployeeApiResource } from './resources/employee-api-resource';
import { Is5LegacyApiResourceInterceptor } from 'src/interceptors/is5-legacy-api-resource.interceptor';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/employees/profile')
export class EmployeeProfileController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new Is5LegacyApiResourceInterceptor(EmployeeApiResource))
  findOne(@CurrentUser() user: Employee): Promise<Employee> {
    return this.employeesService.getProfile(user);
  }
}
