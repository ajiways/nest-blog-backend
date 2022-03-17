import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from './interfaces/validation.error.interface';

export class ValidationException extends HttpException {
  error: ValidationError;

  constructor(error: ValidationError) {
    super(error, HttpStatus.BAD_REQUEST);
  }
}
