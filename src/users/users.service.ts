import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService, FileType } from 'src/file/file.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FileService,
  ) {}

  async createUser(dto: CreateUserDto, file?: any) {
    const errors = {
      email: '',
      password: '',
    };
    let imagePath = '';

    if (file) {
      imagePath = this.fileService.createFile(FileType.IMAGE, file);
    }

    const userCandidate = await this.getUserByEmail(dto.email);
    if (userCandidate) {
      errors.email = 'A user with this Email already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(dto.password, 6);

    const user = await this.userRepository.create({
      ...dto,
      password: hashPassword,
      avatar: imagePath,
    });
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });
    return user;
  }
}
