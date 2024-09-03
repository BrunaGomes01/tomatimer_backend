import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ValidationPipe } from '@nestjs/common';
import { TaskModule } from './modules/task/task.module';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const CSS_URL =
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const builder = new DocumentBuilder()
    .setTitle('Tomatimer Service')
    .setDescription('Repository: tomatimer_backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Smart Lock Token',
        type: 'apiKey',
        in: 'header',
        name: 'authorization',
      },
      'SmartLockToken',
    );
  //.addServer('https://tomatimer-backend.vercel.app/');

  const config = builder.build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [UserModule, AuthModule, TaskModule],
  });

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Backend Generator',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  await app.listen(configService.get('PORT') || 3000);
  console.log(`App running at: http://localhost:${configService.get('PORT')}/`);
}
bootstrap();
