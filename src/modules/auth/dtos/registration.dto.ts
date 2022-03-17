import { IsString, Length, Matches } from 'class-validator';

export class RegistrationDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @Length(4, 16, { message: 'От 4 до 16 символов' })
  login: string;

  @IsString({ message: 'Логин должен быть строкой' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Слишком простой пароль',
  })
  password: string;

  @IsString({ message: 'Подтверждение пароля должно быть строкой' })
  confirm: string;
}
