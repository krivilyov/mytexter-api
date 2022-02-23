import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.model';
import { SubscriptionService } from './subscription.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthorisationModule } from '../authorisation/authorisation.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [SequelizeModule.forFeature([Subscription]), AuthorisationModule],
})
export class SubscriptionModule {}
