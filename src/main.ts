import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BlogModule } from './blog.module';
import { APP_PORT } from './misc/config';

async function bootstrap() {
  const app = await NestFactory.create(BlogModule);

  const options = new DocumentBuilder()
    .setTitle('Blog api')
    .setDescription('For WelbeX test')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(APP_PORT);
}
bootstrap();
