import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegistrationDto } from './dtos/registration.dto';
import { Request, Response } from 'express';
import { GetCookie } from '../../decorators/get-cookie.decorator';
import { TokenService } from '../token/token.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Successfully logged in!' })
  @ApiBadRequestResponse({
    description: 'Some error occured, like wrong password etc.',
  })
  @UsePipes(ValidationPipe)
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const response = await this.authService.login(dto, req.get('User-agent'));

    res.cookie('refreshToken', response.tokens.refreshToken, {
      httpOnly: true,
    });
    res.status(HttpStatus.OK);

    res.json({
      statusCode: HttpStatus.OK,
      message: response.message,
      user: response.user,
      token: response.tokens.accessToken,
    });
  }

  @Post('registration')
  @ApiBody({ type: RegistrationDto })
  @ApiCreatedResponse({ description: 'Successfully registered' })
  @ApiBadRequestResponse({
    description: 'Some error occured, like this login is already taken etc.',
  })
  @UsePipes(ValidationPipe)
  async registration(@Body() data: RegistrationDto) {
    return await this.authService.registration(data);
  }

  @Get('logout')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully logged out!' })
  @ApiBadRequestResponse({
    description:
      'Some error occured, like you need to be logged in to log out etc.',
  })
  async logout(
    @Res({ passthrough: true }) response: Response,
    @GetCookie('refreshToken') token: string,
  ) {
    if (!token) {
      throw new HttpException(
        'To log out, log in first',
        HttpStatus.BAD_REQUEST,
      );
    }

    const decodedData = this.tokenService.validateAccessToken(token);

    if (!decodedData) {
      throw new HttpException('User is unauthorized', HttpStatus.BAD_REQUEST);
    }

    response.clearCookie('refreshToken');
    response.status(HttpStatus.OK);
    return { message: 'Successfully logged out!' };
  }
}
