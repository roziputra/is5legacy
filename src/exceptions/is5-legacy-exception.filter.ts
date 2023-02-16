import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Is5LegacyException } from './is5-legacy.exception';
import { Is5LegacyValidationException } from './is5-legacy-validation.exception';

@Catch(Is5LegacyException)
export class Is5LegacyExceptionFilter implements ExceptionFilter {
  catch(exception: Is5LegacyException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const responseBody = {
      title: exceptionResponse['title'],
      message: exception.message,
    };

    if (exception instanceof Is5LegacyValidationException) {
      responseBody['errors'] = exceptionResponse['errors'];
    }
    response.status(status).json(responseBody);
  }
}
