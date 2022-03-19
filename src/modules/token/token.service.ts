import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign, verify } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { ACCESS_SECRET, REFRESH_SECRET } from '../../misc/config';
import { UserService } from '../user/user.service';
import {
  IAccessPayload,
  IRefreshPayload,
} from './interfaces/payload.interface';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  generateRefreshToken(refreshPayload: IRefreshPayload) {
    const refreshToken = sign(refreshPayload, REFRESH_SECRET, {
      expiresIn: '30d',
    });

    return refreshToken;
  }

  generateAccessToken(payload: IAccessPayload) {
    const accessToken = sign(payload, ACCESS_SECRET, {
      expiresIn: '24h',
    });

    return accessToken;
  }

  validateAccessToken(token: unknown): IAccessPayload | null {
    try {
      const decodedData = verify(
        String(token),
        ACCESS_SECRET,
      ) as IAccessPayload;
      return decodedData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: unknown): IRefreshPayload | null {
    try {
      const decodedData = verify(
        String(token),
        REFRESH_SECRET,
      ) as IRefreshPayload;
      return decodedData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken: unknown) {
    const tokenData = await this.tokenRepository.findOne({
      refreshToken: String(refreshToken),
    });

    if (!tokenData) {
      throw new HttpException(
        'Your refresh token is expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return tokenData;
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({
      where: { user: userId },
    });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }
    const user = await this.userService.findOneWithParams({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return await this.tokenRepository
      .create({
        user,
        refreshToken,
      })
      .save();
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('User is unauthorized');
    }
    const decodedData = this.validateRefreshToken(refreshToken);
    const tokenFromDB = await this.findToken(refreshToken);

    if (!decodedData || !tokenFromDB) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findOneWithParams({
      where: { id: decodedData.id },
    });

    if (!user) {
      throw new HttpException(
        'Server error (User does not exist. Token.)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const token = this.generateRefreshToken({
      agent: decodedData.agent,
      date: decodedData.date,
      id: decodedData.id,
    });

    const accessToken = this.generateAccessToken({
      id: user.id,
      password: user.password,
    });

    const newRefreshToken = await this.saveToken(user.id, token);

    return {
      refreshToken: newRefreshToken.refreshToken,
      accessToken: accessToken,
    };
  }
}
