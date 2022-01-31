import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService, FileType } from 'src/file/file.service';
import * as bcrypt from 'bcryptjs';

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
    const hashPassword = await bcrypt.hash(dto.password, 6);

    const user = await this.userRepository.create({
      ...dto,
      password: hashPassword,
      avatar: imagePath,
    });
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto, file?: any) {
    const errors = {
      email: '',
    };

    const dataForUpdate: UpdateUserDto = {};

    const user = await this.userRepository.findByPk(id);

    let imagePath = '';

    if (file) {
      imagePath = this.fileService.createFile(FileType.IMAGE, file);
      //remove old file
      if (user.avatar) {
        this.fileService.removeFile(user.avatar);
      }

      dataForUpdate.avatar = imagePath;
    }

    if (dto.name && dto.name !== user.name) {
      dataForUpdate.name = dto.name;
    }

    if (dto.email && dto.email !== user.email) {
      const userCandidate = await this.getUserByEmail(dto.email);
      if (userCandidate) {
        errors.email = 'A user with this Email already exists';
        throw new HttpException(errors, HttpStatus.BAD_REQUEST);
      }

      dataForUpdate.email = dto.email;
    }

    if (dto.password) {
      const hashPassword = await bcrypt.hash(dto.password, 6);
      dataForUpdate.password = hashPassword;
    }

    dataForUpdate.role = dto.role;
    dataForUpdate.isActive = dto.isActive;

    const updatedUser = await user.update(dataForUpdate);
    return updatedUser;
  }

  async removeUser(id: string) {
    const userCandidate = await this.userRepository.findByPk(id);

    if (!userCandidate) {
      throw new HttpException('User is not exist', HttpStatus.BAD_REQUEST);
    }

    //delete file
    if (userCandidate.avatar) {
      this.fileService.removeFile(userCandidate.avatar);
    }

    await userCandidate
      .destroy()
      .then(() => {
        return { message: 'Deleted successfully' };
      })
      .catch((error) => {
        return error;
      });
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async getUserByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });
    return user;
  }

  async getUserByConfirmHash(confirmHash: string) {
    const user = this.userRepository.findOne({ where: { confirmHash } });
    return user;
  }

  async getUserByRestoreHash(restoreHash: string) {
    const user = this.userRepository.findOne({ where: { restoreHash } });
    return user;
  }

  async getUserById(id: number) {
    const user = this.userRepository.findByPk(id);
    return user;
  }
}
