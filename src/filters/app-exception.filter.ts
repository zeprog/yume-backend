import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Контекст HTTP запроса
    const response = ctx.getResponse(); // HTTP Response объект
    const request = ctx.getRequest(); // HTTP Request объект

    let status = 500; // Статус ответа по умолчанию
    let message = 'Internal server error'; // Сообщение по умолчанию

    // Если исключение — это HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus(); // Получаем HTTP статус
      const exceptionResponse = exception.getResponse(); // Данные исключения
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse; // Простое сообщение
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message; // Сообщение из объекта
      }
    }

    // Логируем ошибку
    this.logger.error(`Error occurred: ${message}`, (exception as any)?.stack);

    // Формируем ответ для клиента
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
