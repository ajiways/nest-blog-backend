import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { TokenService } from '../modules/token/token.service';
import { UserService } from '../modules/user/user.service';
import { CustomRequest } from './interfaces/custom.request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const token = request.headers.authorization.split(' ')[1];
    const decodedData = this.tokenService.validateAccessToken(token);

    if (!token || !decodedData) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    } else {
      const user = await this.userService.findOneWithParams({
        where: { id: decodedData.id },
      });

      if (!user) {
        throw new HttpException(
          'User is unauthorized',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        request.user = user;
        return true;
      }
    }
  }
}
