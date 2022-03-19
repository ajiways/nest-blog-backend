import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, description: 'User login' })
  @IsString({ message: 'Login must be a string' })
  @Length(4, 16, {
    message: 'Login must be more than 4 and less than 16 characters',
  })
  login: string;

  @ApiProperty({ type: String, description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @Length(6, 16, {
    message: 'Password must be more than 6 and less than 16 characters',
  })
  password: string;
}
