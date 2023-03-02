import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeesService } from './employees.service';
import { GetEmployeeListDto } from './dto/get-employee-list.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @UseGuards(AuthGuard('api-key'))
  @Get('lists')
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
