import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class Is5LegacyResponseInterceptor implements NestInterceptor {
  constructor(@Inject() private readonly response: string) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(() => ({
        title: 'Berhasil',
        message: this.response,
      })),
    );
  }
}
