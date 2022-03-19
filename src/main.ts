import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PostModule } from './modules/post/post.module';
import { APP_PORT, CLIENT_ORIGIN } from './misc/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);

  app.enableCors({ credentials: true, origin: CLIENT_ORIGIN });

  const options = new DocumentBuilder()
    .setTitle('Blog api')
    .setDescription('For WelbeX test')
    .setVersion('0.0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  await app.listen(APP_PORT);
}
bootstrap();
