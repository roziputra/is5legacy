import { HttpException, HttpStatus } from '@nestjs/common';
import { isString } from 'class-validator';

export class Is5LegacyException extends HttpException {
  title: string;
  constructor(
    response?: string | Record<string, any>,
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    if (isString(response)) {
      response = {
        title: 'Error',
        message: response,
      };
    }
    super(response, status);
  }
}
