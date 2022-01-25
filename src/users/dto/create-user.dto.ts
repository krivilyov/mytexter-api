export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;

  readonly confirmHash: string;
  readonly role: string;
  readonly isActive: number;
}
