import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { TokenService } from '../modules/token/token.service';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies.token;
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
        return true;
      }
    }
  }
}
