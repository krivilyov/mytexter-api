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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { CreateLanguageDto } from './dto/create-language.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/')
export class LanguagesController {
  constructor(private languagesService: LanguagesService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/language')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() dto: CreateLanguageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.languagesService.createLanguage(dto, file);
  }

  @Roles('admin', 'customer')
  @UseGuards(RolesGuard)
  @Get('/language/:id')
  getTopic(@Param('id') id: string) {
    return this.languagesService.getLanguageById(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put('/language/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() dto: CreateLanguageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.languagesService.updateLanguage(id, dto, file);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete('/language/:id')
  remove(@Param('id') id: string) {
    return this.languagesService.deleteLanguage(id);
  }

  @Roles('admin', 'customer')
  @UseGuards(RolesGuard)
  @Get('/languages')
  getAllLanguages() {
    return this.languagesService.getAllLanguages();
  }
}
