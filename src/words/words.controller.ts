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
  Query,
} from '@nestjs/common';
import { Roles } from 'src/authorisation/roles.decorator';
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api')
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/word')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() dto: CreateWordDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.wordsService.createWord(dto, file);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/word/:id')
  getWord(@Param('id') id: string) {
    return this.wordsService.getWordById(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put('/word/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() dto: CreateWordDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.wordsService.updateWord(id, dto, file);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete('/word/:id')
  remove(@Param('id') id: string) {
    return this.wordsService.removeWord(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/words')
  getAllUsers() {
    return this.wordsService.getAllWords();
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/word/')
  getWordByQuery(@Query('query') query: string) {
    return this.wordsService.getWordsByQuery(query);
  }

  @Roles('admin', 'customer')
  @UseGuards(RolesGuard)
  @Get('/words/filter/')
  getWordsByFilterQuery(@Query() query) {
    return this.wordsService.getWordsByFilterQuery(query);
  }
}
