import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';

import { Employee } from './employee.entity';
import { GetEmployeeListDto } from './dto/get-employee-list.dto';
import { Is5LegacyException } from '../exceptions/is5-legacy.exception';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getEmployeeListByIdService(getEmployeeListDto: GetEmployeeListDto) {
    const { employeeIds } = getEmployeeListDto;

    const employee = await this.employeeRepository
      .createQueryBuilder('emp')
      .select([
        'emp.EmpId id',
        "concat(emp.EmpFName, ' ', emp.EmpLName) name",
        'emp.EmpEmail email',
      ])
      .where('emp.EmpId IN (:...employeeIds)', { employeeIds: employeeIds })
      .getRawMany();

    if (employee.length == 0) {
      throw new Is5LegacyException('Data karyawan tidak ditemukan', 404);
    }

    return employee;
  }

  async findAll() {
    const employees = await this.employeeRepository.find();
    return employees.map((e) => this.transformEmployee(e));
  }

  async authenticate(username: string, password: string) {
    const user = this.dataSource
      .getRepository(Employee)
      .createQueryBuilder()
      .select([
        'EmpId',
        'EmpFName',
        'EmpLName',
        'EmpEmail',
        'BranchId',
        'DisplayBranchId',
      ])
      .where('EmpId = :username', { username: username })
      .andWhere('EmpPassword = PASSWORD(:password)', { password: password })
      .getRawOne();

    return user;
  }

  getProfile(user): Promise<Employee> {
    return this.employeeRepository.findOneBy({
      EmpId: user.EmpId,
    });
  }

  // employee mapping dari divisi helpdesk '01' -> 'Helpdesk Shift', '17' -> 'Helpdesk Reguler'
  // '020' -> Cabang Medan
  async empMap() {
    const employee = await Employee.GetAllEmployee();
    const empMap: any[] = [];

    // jika ada employee yang pindah keluar dari divisi helpdesk harus diset manual
    // empObj['empId'] = '0200306';
    // empObj['empName'] = 'wardi';

    for (const i of employee) {
      const empObj: any = {};
      empObj['empId'] = i.EmpId;
      empObj['empName'] = i.EmpFName + ' ' + i.EmpLName;
      empMap.push(empObj);
    }
    return empMap;
  }

  private transformEmployee(obj) {
    return {
      id: obj.EmpId,
      name: (obj.EmpFName + ' ' + obj.EmpLName).trim(),
      email: obj.EmpEmail,
    };
  }
}
