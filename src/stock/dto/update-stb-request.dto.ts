import { PartialType } from '@nestjs/mapped-types';
import { CreateStbRequestDto } from './create-stb-request.dto';

export class UpdateStbRequestDto extends PartialType(CreateStbRequestDto) {}
