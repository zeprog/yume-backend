import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './filters/app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Подключаем фильтр ошибок
  app.useGlobalFilters(new AppExceptionFilter());

  // Включаем CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Добавляем глобальный префикс
  app.setGlobalPrefix('api');

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Video Call API')
    .setDescription('API documentation for the video call application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Включаем глобальную валидацию
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
