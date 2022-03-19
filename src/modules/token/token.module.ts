import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  providers: [TokenService, UserService],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
