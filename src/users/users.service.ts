import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FileService,
  ) {}

  async createUser(dto: CreateUserDto, file?: any) {
    let imagePath = '';

    if (file) {
      imagePath = this.fileService.createFile(FileType.IMAGE, file);
    }

    const user = await this.userRepository.create({
      ...dto,
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
