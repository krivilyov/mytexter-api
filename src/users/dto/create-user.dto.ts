import { Matches, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @Matches(/[a-zA-Z][a-zA-Z0-9-_]{3,10}/, {
    message:
      'The name must be no shorter than 3 characters and no longer than 10',
  })
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/, {
    message:
      'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character.',
  })
  readonly password: string;

  readonly confirmHash: string;
  readonly role: string;
  readonly isActive: number;
}
