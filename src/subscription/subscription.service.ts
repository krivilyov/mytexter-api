import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from './subscription.model';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionRepository: typeof Subscription,
  ) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const errors = {
      email: '',
    };

    if (!dto.email) {
      errors.email = 'Поле не должно быть пустым';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const candidateSubscription = await this.getSubscriptionByEmail(dto.email);
    if (candidateSubscription) {
      errors.email = 'Вы уже подписаны на рассылку';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    const subscription = await this.subscriptionRepository.create({
      ...dto,
    });

    return subscription;
  }

  async getSubscriptionByEmail(email: string) {
    const subscription = this.subscriptionRepository.findOne({
      where: { email },
    });
    return subscription;
  }

  async getAllSubscriptions() {
    const subscriptions = await this.subscriptionRepository.findAll();
    return subscriptions;
  }
}
