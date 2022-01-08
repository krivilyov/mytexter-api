import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLevelDto } from './dto/create-level.dto';
import { Level } from './level.model';
import transliterate from '../helpers/transliteration';

@Injectable()
export class LevelsService {
  constructor(@InjectModel(Level) private levelRepository: typeof Level) {}

  async createLevel(dto: CreateLevelDto) {
    const errors = {
      title: '',
    };
    const candidateLevel = await this.getLevelByTitle(dto.title);
    if (candidateLevel) {
      errors.title = 'A level with this title already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const alias = transliterate(dto.title.toLowerCase());
    const level = await this.levelRepository.create({
      ...dto,
      alias: alias,
    });
    return level;
  }

  async getLevelById(id: string) {
    const level = this.levelRepository.findByPk(id);
    return level;
  }

  async updateLevel(id: string, dto: CreateLevelDto) {
    const errors = {
      title: '',
    };

    const candidateLevel = await this.getLevelByTitle(dto.title);
    //for change food -> Food
    if (candidateLevel && candidateLevel.title === dto.title) {
      errors.title = 'A level with this title already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const level = await this.levelRepository.findByPk(id);
    const alias = transliterate(dto.title.toLowerCase());
    const updatedLevel = await level.update({ alias: alias, title: dto.title });
    return updatedLevel;
  }

  async deleteLevel(id: string) {
    const level = await this.levelRepository.findByPk(id);
    if (!level) {
      throw new HttpException('Level is not exist', HttpStatus.BAD_REQUEST);
    }

    await level
      .destroy()
      .then(() => {
        return { message: 'Deleted successfully' };
      })
      .catch((error) => {
        return error;
      });
  }

  async getAllLevels() {
    const levels = await this.levelRepository.findAll();
    return levels;
  }

  async getLevelByTitle(title: string) {
    const level = this.levelRepository.findOne({ where: { title } });
    return level;
  }
}
