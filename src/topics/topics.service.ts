import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Topic } from './topic.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTopicDto } from './dto/create-topic.dto';
import transliterate from '../helpers/transliteration';

@Injectable()
export class TopicsService {
  constructor(@InjectModel(Topic) private topicRepository: typeof Topic) {}

  async createTopic(dto: CreateTopicDto) {
    const errors = {
      title: '',
    };
    const candidateTopic = await this.getTopicByTitle(dto.title);
    if (candidateTopic) {
      errors.title = 'A topic with this title already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const alias = transliterate(dto.title.toLowerCase());
    const topic = await this.topicRepository.create({
      ...dto,
      alias: alias,
    });
    return topic;
  }

  async getTopicById(id: string) {
    const topic = this.topicRepository.findByPk(id);
    return topic;
  }

  async updateTopic(id: string, dto: CreateTopicDto) {
    const errors = {
      title: '',
    };

    const candidateTopic = await this.getTopicByTitle(dto.title);
    //for change food -> Food
    if (candidateTopic && candidateTopic.title === dto.title) {
      errors.title = 'A topic with this title already exists';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const topic = await this.topicRepository.findByPk(id);
    const alias = transliterate(dto.title.toLowerCase());
    const updatedTopic = await topic.update({ alias: alias, title: dto.title });
    return updatedTopic;
  }

  async deleteTopic(id: string) {
    const topic = await this.topicRepository.findByPk(id);
    if (!topic) {
      throw new HttpException('Topic is not exist', HttpStatus.BAD_REQUEST);
    }

    await topic
      .destroy()
      .then(() => {
        return { message: 'Deleted successfully' };
      })
      .catch((error) => {
        return error;
      });
  }

  async getAllTopics() {
    const topics = await this.topicRepository.findAll();
    return topics;
  }

  async getTopicByTitle(title: string) {
    const topic = this.topicRepository.findOne({ where: { title } });
    return topic;
  }
}
