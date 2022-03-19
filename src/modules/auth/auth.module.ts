import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { Token } from '../token/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [AuthService, UserService, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
