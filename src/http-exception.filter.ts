import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      (exceptionResponse && typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message
        : exception.message) || '服务器内部错误';

    response.status(status).json({
      code: status,
      success: false,
      message,
      data: status !== 500 ? null : exception.stack, // 500 错误时返回错误堆栈，其他情况不返回
    });
  }
}
