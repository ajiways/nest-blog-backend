import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @Length(4, 16, { message: 'От 4 до 16 символов' })
  login: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(6, 16, { message: 'Пароль должен быть от 6 до 16 символов' })
  passowrd: string;
}
