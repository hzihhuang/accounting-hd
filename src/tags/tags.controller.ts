import { Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetUser } from '@/decorators/getUser.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Get()
  async getTags(@GetUser('userId') userId) {
    return this.tagsService.getTags(userId);
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto, @GetUser('userId') userId) {
    return this.tagsService.create(userId, createTagDto);
  }

  @Delete(':id')
  async remove(@GetUser('userId') userId: number, @Param('id') tagId: number) {
    return this.tagsService.remove(userId, tagId);
  }
}
