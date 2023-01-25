import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      title: 'Error',
      message: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      responseBody.title = exceptionResponse['title'] ?? responseBody.title;
      responseBody.message = exception.message;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    Logger.error(exception);
    console.info(exception);
  }
}
