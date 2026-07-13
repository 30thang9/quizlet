import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter, TransformInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security headers
  app.use(helmet());

  // CORS
  const corsOrigins = configService.get<string>('CORS_ORIGINS', 'http://localhost:4000');
  app.enableCors({
    origin: corsOrigins.split(',').map(s => s.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'v1');
  app.setGlobalPrefix(apiPrefix);

  // Global filters and interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED', true);
  if (swaggerEnabled) {
    const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');
    const config = new DocumentBuilder()
      .setTitle('Quizlet Clone API')
      .setDescription('API documentation for Quizlet Clone application')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('study-sets', 'Study set operations')
      .addTag('cards', 'Card operations')
      .addTag('classes', 'Class management')
      .addTag('search', 'Search functionality')
      .addTag('comments', 'Comments and likes')
      .addTag('versions', 'Version history')
      .addTag('diagrams', 'Diagram management')
      .addTag('ai', 'AI-powered features')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 Quizlet API is running on: http://localhost:${port}`);
  if (swaggerEnabled) {
    logger.log(`📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`);
  }
}

bootstrap();
