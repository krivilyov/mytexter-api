import { TopicsService } from './topics.service';
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
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { CreateTopicDto } from './dto/create-topic.dto';

@Controller('/api')
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/topic')
  create(@Body() dto: CreateTopicDto) {
    return this.topicsService.createTopic(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/topic/:id')
  getTopic(@Param('id') id: string) {
    return this.topicsService.getTopicById(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put('/topic/:id')
  update(@Param('id') id: string, @Body() dto: CreateTopicDto) {
    return this.topicsService.updateTopic(id, dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete('/topic/:id')
  remove(@Param('id') id: string) {
    return this.topicsService.deleteTopic(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/topics')
  getAllUsers() {
    return this.topicsService.getAllTopics();
  }
}
