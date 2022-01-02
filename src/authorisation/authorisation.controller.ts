import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthorisationService } from './authorisation.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('/api/auth')
export class AuthorisationController {
  constructor(private authorisationServise: AuthorisationService) {}

  @Post('/login')
  async login(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authorisationServise.login(userDto);

    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=21600`;
    response.setHeader('Set-Cookie', cookie);
    return { success: true };
  }

  @Post('/registration')
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authorisationServise.registration(userDto);

    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=21600`;
    response.setHeader('Set-Cookie', cookie);
    return { success: true };
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    const cookie = `token='empty'; HttpOnly; Path=/; Max-Age=0`;
    response.setHeader('Set-Cookie', cookie);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return this.authorisationServise.getProfile(req.user);
  }
}