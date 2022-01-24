import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Word } from '../words/word.model';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import transliterate from '../helpers/transliteration';
import { FileService, FileType } from 'src/file/file.service';
import { Op } from 'sequelize';

@Injectable()
export class WordsService {
  constructor(
    @InjectModel(Word) private wordRepository: typeof Word,
    private fileService: FileService,
  ) {}

  async createWord(dto: CreateWordDto, file?: any) {
    let imagePath = '';
    const alias = transliterate(dto.title.toLowerCase());
    if (file) {
      imagePath = this.fileService.createFile(FileType.IMAGE, file);
    }

    const word = await this.wordRepository.create({
      ...dto,
      alias: alias,
      image: imagePath,
    });

    if (dto.translations.length) {
      const translationsId = JSON.parse('[' + dto.translations + ']');
      translationsId.map((id: number) => {
        word.$set('t_words', id);
      });
    }

    return word;
  }

  async updateWord(id: string, dto: UpdateWordDto, file?: any) {
    const wordCandidate = await this.wordRepository.findByPk(id);
    let imagePath = '';
    if (file) {
      imagePath = this.fileService.createFile(FileType.IMAGE, file);
      //remove old file
      if (wordCandidate.image) {
        this.fileService.removeFile(wordCandidate.image);
      }
    } else {
      imagePath = wordCandidate.image;
    }

    //translations update
    if (dto.translations.length) {
      const translations = JSON.parse(dto.translations);
      translations.map((word) => {
        wordCandidate.$remove('t_words', word.id);
        wordCandidate.$set('t_words', word.id);
      });
    } else {
      wordCandidate.$get('t_words').then((res) => {
        res.map((word) => {
          const data = word.get({ plain: true });
          wordCandidate.$remove('t_words', data.id);
        });
      });
    }

    await wordCandidate.update({
      ...dto,
      image: imagePath,
    });

    const updatedWord = await this.wordRepository.findByPk(id, {
      include: { all: true },
    });

    return updatedWord;
  }

  async removeWord(id: string) {
    const word = await this.wordRepository.findByPk(id);

    if (!word) {
      throw new HttpException('Word is not exist', HttpStatus.BAD_REQUEST);
    }

    //delete file
    if (word.image) {
      this.fileService.removeFile(word.image);
    }

    await word
      .destroy()
      .then()
      .catch((error) => {
        return error;
      });

    const words = await this.wordRepository.findAll({
      include: { all: true },
    });

    return words;
  }

  async getAllWords() {
    const words = await this.wordRepository.findAll({ include: { all: true } });
    return words;
  }

  async getWordById(id: string) {
    const word = this.wordRepository.findByPk(id, {
      include: { all: true, nested: true },
    });
    return word;
  }

  async getWordsByQuery(query: string) {
    const words = await this.wordRepository.findAll({
      include: { all: true },
      where: { title: { [Op.like]: `%${query}%` } },
    });
    return words;
  }
}