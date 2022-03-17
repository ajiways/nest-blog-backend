import { HttpStatus } from '@nestjs/common';

export interface ValidationError {
  message: string;
  errors: string[];
  statusCode: HttpStatus;
}
