import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/authorisation/roles.decorator';
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api')
export class UsersController {
  constructor(private usersServise: UsersService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/user/:id')
  getUser(@Param() params) {
    const id = Number(params.id);
    return this.usersServise.getUserById(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/user')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() userDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersServise.createUser(userDto, file);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put('/user/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersServise.updateUser(Number(id), userDto, file);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/users')
  getAllUsers() {
    return this.usersServise.getAllUsers();
  }
}
