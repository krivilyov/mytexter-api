import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { Roles } from 'src/authorisation/roles.decorator';
import { SubscriptionService } from './subscription.service';
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('api/')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('/subscription')
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/subscriptions')
  getAllTopics() {
    return this.subscriptionService.getAllSubscriptions();
  }
}
