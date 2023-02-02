import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Is5LegacyException } from './is5-legacy.exception';

@Catch(Is5LegacyException)
export class Is5LegacyExceptionFilter implements ExceptionFilter {
  catch(exception: Is5LegacyException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      title: exceptionResponse['title'],
      message: exception.message,
    });
  }
}
