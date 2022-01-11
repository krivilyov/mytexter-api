import { Roles } from 'src/authorisation/roles.decorator';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { CreateLanguageDto } from './dto/create-language.dto';

@Controller('api/')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/language')
  create(@Body() dto: CreateLanguageDto) {
    return this.languagesService.createLanguage(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/language/:id')
  getTopic(@Param('id') id: string) {
    return this.languagesService.getLanguageById(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put('/language/:id')
  update(@Param('id') id: string, @Body() dto: CreateLanguageDto) {
    return this.languagesService.updateLanguage(id, dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete('/language/:id')
  remove(@Param('id') id: string) {
    return this.languagesService.deleteLanguage(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/languages')
  getAllUsers() {
    return this.languagesService.getAllLanguages();
  }
}
