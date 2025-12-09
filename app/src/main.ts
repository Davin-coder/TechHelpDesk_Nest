import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerCfg = configService.get<{
    title: string;
    description: string;
    version: string;
    path: string;
  }>('swagger');

  const swaggerDocumentConfig = new DocumentBuilder()
    .setTitle(swaggerCfg?.title ?? 'API')
    .setDescription(swaggerCfg?.description ?? 'API documentation')
    .setVersion(swaggerCfg?.version ?? '1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup(swaggerCfg?.path ?? 'docs', app, document);

  const appConfig = configService.get<{ port: number }>('app');
  const port = appConfig?.port ?? 3000;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}${swaggerCfg?.path ?? 'docs'}`);
}

bootstrap();