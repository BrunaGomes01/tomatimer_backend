import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ValidationPipe } from '@nestjs/common';
import { TaskModule } from './modules/task/task.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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

  const config = builder.build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [UserModule, AuthModule, TaskModule],
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT') || 3000);
  console.log(`App running at: http://localhost:${configService.get('PORT')}/`);
}
bootstrap();
