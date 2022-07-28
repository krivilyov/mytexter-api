import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Language } from './language.model';
import { CreateLanguageDto } from './dto/create-language.dto';
import transliterate from '../helpers/transliteration';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language) private languageRepository: typeof Language,
    private fileService: FileService,
  ) {}

  async createLanguage(dto: CreateLanguageDto, file?: any) {
    const errors = {
      title: '',
    };
    let imagePath = '';
    const candidateLanguage = await this.getLanguageByTitle(dto.title);
    if (candidateLanguage) {
      errors.title = 'A language with this title already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const alias = transliterate(dto.title.toLowerCase());

    if (file) {
      imagePath = this.fileService.createFile(FileType.IMAGE, file);
    }

    const language = await this.languageRepository.create({
      ...dto,
      alias: alias,
      img: imagePath,
    });
    return language;
  }

  async getLanguageById(id: string) {
    const language = this.languageRepository.findByPk(id);
    return language;
  }

  async updateLanguage(id: string, dto: CreateLanguageDto, file?: any) {
    const errors = {
      title: '',
    };
    let imagePath = '';

    const candidateLanguage = await this.getLanguageByTitle(dto.title);
    //for change food -> Food
    if (candidateLanguage && candidateLanguage.id !== Number(id)) {
      errors.title = 'A language with this title already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const language = await this.languageRepository.findByPk(id);
    const alias = transliterate(dto.title.toLowerCase());

    if (file) {
      imagePath = this.fileService.createFile(FileType.IMAGE, file);
      //remove old file
      if (language.img) {
        this.fileService.removeFile(language.img);
      }
    } else {
      imagePath = language.img;
    }

    const updatedLanguage = await language.update({
      ...dto,
      alias: alias,
      isActive: dto.isActive,
      img: imagePath,
    });
    return updatedLanguage;
  }

  async deleteLanguage(id: string) {
    const language = await this.languageRepository.findByPk(id);
    if (!language) {
      throw new HttpException('Language is not exist', HttpStatus.BAD_REQUEST);
    }

    //delete file
    if (language.img) {
      this.fileService.removeFile(language.img);
    }

    await language
      .destroy()
      .then(() => {
        return { message: 'Deleted successfully' };
      })
      .catch((error) => {
        return error;
      });
  }

  async getAllLanguages() {
    const languages = await this.languageRepository.findAll();
    return languages;
  }

  async getLanguageByTitle(title: string) {
    const language = this.languageRepository.findOne({ where: { title } });
    return language;
  }

  async getLanguageByCode(code: string) {
    const language = await this.languageRepository.findOne({
      where: { code: code },
    });
    return language;
  }
}
