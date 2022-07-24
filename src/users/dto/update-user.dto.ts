export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  confirmHash?: string;
  role?: string;
  avatar?: string;
  isActive?: number;
  restoreHash?: string;
  userLang?: number;
  learningLang?: number;
}
