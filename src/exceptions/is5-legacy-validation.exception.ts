import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Is5LegacyException } from './is5-legacy.exception';

export class Is5LegacyValidationException extends Is5LegacyException {
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
        const dataValidations = Is5LegacyValidationException.getErrorMessage(i);
        if (Array.isArray(dataValidations)) {
          for (const dataValidation of dataValidations) {
            dataValidation.map((i) => {
              data[i['property']] = i['message'];
            });
          }
        } else {
          data[dataValidations['property']] = dataValidations['message'];
        }
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

  static getErrorMessage(error: ValidationError) {
    const child = error.children;
    const lastProp = error['lastProp'] ?? error.property;
    if (child.length > 0) {
      return child.map((i) => {
        i['lastProp'] = `${lastProp}.${i.property}`;
        return Is5LegacyValidationException.getErrorMessage(i);
      });
    }
    return {
      property: lastProp,
      message: Object.values(error.constraints)[0],
    };
  }
}
