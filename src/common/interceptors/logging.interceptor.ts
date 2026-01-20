// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const className = context.getClass().name;
        const handlerName = context.getHandler().name;

        // Log profesional con contexto de clase y método para auditoría
        this.logger.log(
          `[${className}.${handlerName}] ${method} ${url} - Completado en ${duration}ms`
        );
      }),
    );
  }
}