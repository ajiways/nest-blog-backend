import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
config();

const configService = new ConfigService();

export const PG_HOST = configService.get<string>('PG_HOST');
export const PG_USER = configService.get<string>('PG_USER');
export const PG_PASSWORD = configService.get<string>('PG_PASSWORD');
export const PG_DATABASE = configService.get<string>('PG_DATABASE');
export const PG_PORT = configService.get<number>('PG_PORT');
export const APP_PORT = configService.get<number>('APP_PORT');
export const REFRESH_SECRET = configService.get<string>('REFRESH_SECRET');
export const ACCESS_SECRET = configService.get<string>('ACCESS_SECRET');
