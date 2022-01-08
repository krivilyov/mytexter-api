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
import { Roles } from 'src/authorisation/roles.decorator';
import { LevelsService } from './levels.service';
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { CreateLevelDto } from './dto/create-level.dto';

@Controller('/api')
export class LevelsController {
  constructor(private levelsService: LevelsService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post('/level')
  create(@Body() dto: CreateLevelDto) {
    return this.levelsService.createLevel(dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/level/:id')
  getTopic(@Param('id') id: string) {
    return this.levelsService.getLevelById(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Put('/level/:id')
  update(@Param('id') id: string, @Body() dto: CreateLevelDto) {
    return this.levelsService.updateLevel(id, dto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete('/level/:id')
  remove(@Param('id') id: string) {
    return this.levelsService.deleteLevel(id);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('/levels')
  getAllUsers() {
    return this.levelsService.getAllLevels();
  }
}
