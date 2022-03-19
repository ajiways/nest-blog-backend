import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { GetCookie } from '../../decorators/get-cookie.decorator';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('refresh')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Token was successfully updated' })
  @ApiUnauthorizedResponse({
    description: 'Some error occured, like you refresh token is expired etc.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Some serious error occured, please, let me know about it :)',
  })
  async refresh(
    @GetCookie('refreshToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.tokenService.refresh(token);

    res.cookie('refreshToken', result.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      status: HttpStatus.OK,
      message: 'Token was successfully updated!',
      token: result.accessToken,
    };
  }
}
