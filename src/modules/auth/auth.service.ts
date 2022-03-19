import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { AuthException } from '../../errors/auth.exceptions';
import { LoginDto } from './dtos/login.dto';
import { RegistrationDto } from './dtos/registration.dto';
import { UserService } from '../user/user.service';
import {
  IAccessPayload,
  IRefreshPayload,
} from '../token/interfaces/payload.interface';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(data: LoginDto, agent: string) {
    const candidate = await this.userService.findOneWithParams({
      where: { login: data.login },
    });

    if (!candidate) {
      throw new AuthException('Wrong login or password');
    } else {
      const isMatch = await compare(data.password, candidate.password);

      if (!isMatch) {
        throw new AuthException('Wrong login or password');
      } else {
        const accessPayload: IAccessPayload = {
          id: candidate.id,
          password: candidate.password,
        };

        const refreshPayload: IRefreshPayload = {
          agent,
          date: Date.now(),
          id: candidate.id,
        };

        const refreshToken =
          this.tokenService.generateRefreshToken(refreshPayload);
        const accessToken =
          this.tokenService.generateAccessToken(accessPayload);

        await this.tokenService.saveToken(candidate.id, refreshToken);

        return {
          message: 'Successfully logged in!',
          user: candidate,
          tokens: {
            accessToken,
            refreshToken,
          },
        };
      }
    }
  }

  async registration(data: RegistrationDto) {
    console.log(data);
    if (data.confirm !== data.password) {
      throw new AuthException('Passwords mismatches');
    }

    const candidate = await this.userService.findOneWithParams({
      where: { login: data.login },
    });

    if (candidate) {
      throw new AuthException(
        `User with login: "${data.login}" already exists`,
      );
    }

    const hashedPassword = await hash(data.password, 7);

    const user = await this.userService.createUser({
      login: data.login,
      password: hashedPassword,
    });

    return {
      message: 'Successfully registrated!',
      user,
    };
  }
}
