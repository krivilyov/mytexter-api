import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { AuthorisationModule } from '../authorisation/authorisation.module';
import { FileService } from '../file/file.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, FileService],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => AuthorisationModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
