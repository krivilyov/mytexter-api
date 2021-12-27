import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.model';

@Injectable()
export class AuthorisationService {
  constructor(
    private userServise: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return await this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const errors = {
      email: '',
      password: '',
    };
    const userCandidate = await this.userServise.getUserByEmail(userDto.email);

    if (userCandidate) {
      errors.email = 'A user with this Email already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 6);
    const user = await this.userServise.createUser({
      ...userDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userServise.getUserByEmail(userDto.email);

    const errors = {
      email: '',
      password: '',
    };

    if (!user) {
      errors.email = 'There is no user with this E-mail';
      throw new UnauthorizedException(errors);
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (passwordEquals) {
      return user;
    }

    errors.password = 'Invalid password';
    throw new UnauthorizedException(errors);
  }

  async getProfile(user: any) {
    const currentUser = await this.userServise.getUserByEmail(user.email);
    const currentDate = Math.floor(Date.now() / 1000);
    if (currentUser) {
      //check token time
      if (user.exp < currentDate) {
        return null;
      }
    }

    return user;
  }
}
