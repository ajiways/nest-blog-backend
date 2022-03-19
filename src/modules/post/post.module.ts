import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { typeOrmConfigAsync } from '../../config/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { User } from '../user/user.entity';
import { Post } from './post.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Post, User]),
    AuthModule,
    TokenModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
