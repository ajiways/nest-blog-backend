import { HttpException } from '@nestjs/common';
import { ApiStatus } from './misc/api.codes.enum';

export class ApiException extends HttpException {
  constructor(message: string, status: ApiStatus) {
    super(message, status);
    this.name = 'ApiException';
  }
}
