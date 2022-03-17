import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { typeOrmConfigAsync } from './config/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { Post } from './post.entity';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Post]),
    AuthModule,
    TokenModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
