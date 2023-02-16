import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Is5LegacyValidationException } from 'src/exceptions/is5-legacy-validation.exception';

@Injectable()
export class Is5LegacyValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);

    const errors = await validate(object, {
      validationError: {
        target: false,
        value: false,
      },
      stopAtFirstError: true,
    });
    if (errors.length > 0) {
      throw new Is5LegacyValidationException(errors);
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
