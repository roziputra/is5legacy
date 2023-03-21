import {
  Controller,
  Get,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeesService } from './employees.service';
import { GetEmployeeListDto } from './dto/get-employee-list.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { FilterPaginationDto } from './dto/filter-pagination.dto';
import { Is5LegacyApiResourceInterceptor } from 'src/interceptors/is5-legacy-api-resource.interceptor';
import { EmployeeApiResource } from './resources/employee-api-resource';

@Controller()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new Is5LegacyApiResourceInterceptor(EmployeeApiResource))
  @Get('api/v1/employees')
  findAll(
    @Query() filterEmployeeDto: FilterEmployeeDto,
    @Query() filterPaginationDto: FilterPaginationDto,
  ) {
    const { page, limit } = filterPaginationDto;
    const { branchId, departmentId, status } = filterEmployeeDto;
    return this.employeesService.findAll(branchId, departmentId, status, {
      page: page,
      limit: limit,
    });
  }

  @UseGuards(AuthGuard('api-key'))
  @Get('employees/lists')
  async getEmployeeListById(@Query() getEmployeeListDto: GetEmployeeListDto) {
    const resultEmployee =
      await this.employeesService.getEmployeeListByIdService(
        getEmployeeListDto,
      );

    return {
      data: resultEmployee,
    };
  }
}
