import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, headers, user } = req;
    
    this.logger.debug(
      `收到请求 - Method: ${method} URL: ${url}\n` +
      `用户: ${user ? JSON.stringify(user) : '未认证'}\n` +
      `Headers: ${JSON.stringify(headers)}`
    );

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.debug(
            `请求完成 - ${method} ${url} ${Date.now() - now}ms\n` +
            `响应: ${JSON.stringify(data)}`
          );
        },
        error: (error) => {
          this.logger.error(
            `请求失败 - ${method} ${url} ${Date.now() - now}ms\n` +
            `错误: ${JSON.stringify(error.message)}\n` +
            `状态码: ${error.status}`
          );
        },
      }),
    );
  }
}
