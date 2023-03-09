import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class StbTransferApiResourceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user?.user;
    return next.handle().pipe(
      map((res) => {
        const newResource = instanceToPlain(res);
        if (res.createdBy == user.EmpId) {
          newResource.transfer_type = 'permintaan';
        }
        if (res.engineer == user.EmpId) {
          newResource.transfer_type = 'penerimaan';
        }
        return newResource;
      }),
    );
  }
}
