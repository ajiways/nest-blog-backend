import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IParams } from '../../interfaces/params.interface';
import { IRelations } from '../../interfaces/relations.interface';
import { CreateUserDto } from './dtos/create.user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneWithParams(params: IParams, relations?: IRelations) {
    return await this.userRepository.findOne({ ...params, ...relations });
  }

  async createUser(data: CreateUserDto) {
    return await this.userRepository.save({
      login: data.login,
      password: data.password,
    });
  }
}
