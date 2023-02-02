import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Is5LegacyException } from './is5-legacy.exception';

export class Is5LegacyValidationException extends Is5LegacyException {
  title: string;
  constructor(
    response?: string | Record<string, any> | Array<ValidationError>,
    description = 'Unprocessable Entity',
  ) {
    const responseBody = {
      title: 'Error',
      message: description,
    };

    if (typeof response === 'string') {
      responseBody.message = response;
    }

    if (response instanceof Array<ValidationError>) {
      responseBody['errors'] = response.reduce((data, i) => {
        data[i.property] = Object.values(i.constraints);
        return data;
      }, {});
    } else {
      const keys = Object.keys(response);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        responseBody[key] = response[key];
      }
    }
    super(responseBody, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
