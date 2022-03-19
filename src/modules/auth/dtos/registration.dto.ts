import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class RegistrationDto {
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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too easy, try to add 1 capital letter, 1 lowercase letter, one digit etc',
  })
  password: string;

  @ApiProperty({ type: String, description: 'Password confirm' })
  @IsString({ message: 'Password confirm must be a string' })
  confirm: string;
}
