import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { Observable, map } from 'rxjs';

/**
 * kelas ini digunakan sebagai interceptor yang mengubah kelas API Resource
 */
export class Is5LegacyApiResourceInterceptor implements NestInterceptor {
  /**
   * @param cls : kelas API Resource misal: CustomerApiResouce
   * kelas Api Resouce wajib menggunakan @Expose
   * option 'name' di @Expose hanya dibutuhkan jika ingin mengubah respon property
   */
  constructor(@Inject() private readonly cls: ClassConstructor<any>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const transform = plainToInstance(this.cls, data, {
          ignoreDecorators: true,
          excludeExtraneousValues: true,
        });
        return instanceToPlain(transform);
      }),
    );
  }
}
