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
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthorisationService {
  constructor(
    private userServise: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return await this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const errors = {
      name: '',
      email: '',
      password: '',
    };
    const userCandidate = await this.userServise.getUserByEmail(userDto.email);

    if (userCandidate) {
      errors.email = 'A user with this Email already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 6);
    const confirmHash = uuidv4();
    const activationLink = `${process.env.API_URL}/api/auth/user-activate/${confirmHash}`;

    const user = await this.userServise.createUser({
      ...userDto,
      confirmHash: confirmHash,
      password: hashPassword,
    });

    this.mailerService
      .sendMail({
        to: userDto.email, // list of receivers
        from: process.env.SMTP_USER, // sender address
        subject: `Подтверждение аккаунта на сайте my-texter.com`,
        text: '',
        html: `<div><h1>Для активации аккаунта необходимо перейти по ссылке</h1><a href="${activationLink}">Активировать аккаунт</a></div>`,
      })
      .then()
      .catch((errors) => {
        console.log(errors);
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

  async activateProfile(confirmHash: string) {
    const user = await this.userServise.getUserByConfirmHash(confirmHash);
    if (!user) {
      throw new HttpException('User is not exist', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await user.update({ isActive: 1, confirmHash: 'NULL' });
    return updatedUser;
  }
}
