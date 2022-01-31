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
    const errors = {
      email: '',
    };

    //validate email
    const filterEmail =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filterEmail.test(String(userDto.email).toLowerCase())) {
      errors.email = 'Это должен быть действительный адрес электронной почты';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const user = await this.validateUser(userDto);
    if (!user.isActive) {
      errors.email = `Вам необходимо активировать свою учетную запись для почты ${user.email}`;
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

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
      errors.email =
        'Пользователь с этим адресом электронной почты уже существует';
    }

    //custom validate dto
    //validate name
    const filterName = /[a-zA-Zа-яА-ЯёЁ0-9-_\.]{3,20}$/;
    if (!filterName.test(String(userDto.name).toLowerCase())) {
      errors.name = 'Имя должно быть не короче 3 символов и не длиннее 10';
    }

    //validate email
    const filterEmail =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filterEmail.test(String(userDto.email).toLowerCase())) {
      errors.email = 'Это должен быть действительный адрес электронной почты';
    }

    //validate password
    const filterPassword =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
    if (!filterPassword.test(String(userDto.password).toLowerCase())) {
      errors.password =
        'Пароль должен состоять из 6-12 символов и содержать не менее 1 буквы, 1 цифры и 1 специального символа.';
    }

    if (errors.name.length || errors.email.length || errors.password.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const confirmHash = uuidv4();
    const activationLink = `${process.env.API_URL}/api/auth/user-activate/${confirmHash}`;

    const user = await this.userServise.createUser({
      ...userDto,
      confirmHash: confirmHash,
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
      isActive: user.isActive,
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
      errors.email =
        'Пользователь с этим адресом электронной почты не зарегистрирован';
      throw new UnauthorizedException(errors);
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (passwordEquals) {
      return user;
    }

    errors.password = 'Вы ввели неверный пароль';
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

    const updatedUser = await user.update({ isActive: 1, confirmHash: null });
    return updatedUser;
  }

  async restorePassword(email: string) {
    const userCandidate = await this.userServise.getUserByEmail(email);

    if (!userCandidate) {
      throw new HttpException(
        'Пользователь с таким Email не найден',
        HttpStatus.BAD_REQUEST,
      );
    }

    const restoreHash = uuidv4();
    const updatedUser = await userCandidate.update({
      restoreHash: restoreHash,
    });
    const restoreLink = `${process.env.CLIENT_URL}/auth/repassword/${restoreHash}`;

    this.mailerService
      .sendMail({
        to: updatedUser.email, // list of receivers
        from: process.env.SMTP_USER, // sender address
        subject: `Запрос на смену пароля для пользователя с Email ${updatedUser.email} на сайте my-texter.com`,
        text: '',
        html: `<div><h1>Для смены пароля необходимо перейти по ссылке</h1><a href="${restoreLink}">Сменить пароль</a></div>`,
      })
      .then()
      .catch((errors) => {
        console.log(errors);
      });

    if (updatedUser) {
      return { success: true };
    }
  }

  async checkUserForRestore(restoreHash: string) {
    const user = await this.userServise.getUserByRestoreHash(restoreHash);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async changePassword(userDto: CreateUserDto) {
    const errors = {
      password: '',
    };

    //validate password
    const filterPassword =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
    if (!filterPassword.test(String(userDto.password).toLowerCase())) {
      errors.password =
        'Пароль должен состоять из 6-12 символов и содержать не менее 1 буквы, 1 цифры и 1 специального символа.';
    }

    if (errors.password.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const userCandidate = await this.userServise.getUserByRestoreHash(
      userDto.restoreHash,
    );

    if (!userCandidate) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 6);

    await userCandidate.update({
      password: hashPassword,
      restoreHash: null,
    });

    return { success: true };
  }
}
