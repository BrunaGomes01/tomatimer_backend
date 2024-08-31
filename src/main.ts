import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const builder = new DocumentBuilder()
    .setTitle('Tomatimer Service')
    .setDescription('Repository: tomatimer_backend')
    .setVersion('1.0');

  const config = builder.build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [],
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT'));
  console.log(`App running at: http://localhost:${configService.get('PORT')}/`);
}
bootstrap();
