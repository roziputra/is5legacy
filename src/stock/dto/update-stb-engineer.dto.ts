import { PartialType } from '@nestjs/mapped-types';
import { CreateStbEngineerDto } from './create-stb-engineer.dto';

export class UpdateStbEngineerDto extends PartialType(CreateStbEngineerDto) {}
