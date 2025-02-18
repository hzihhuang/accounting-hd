import { Body, Controller, Delete, Get, Post, Request } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetUser } from '@/decorators/getUser.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Get()
  async getTags(@GetUser('userId') userId) {
    return await this.tagsService.getTags(userId);
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto, @GetUser('userId') userId) {
    return this.tagsService.create(createTagDto, userId);
  }

  @Delete(':id')
  async remove(@Request() req, @GetUser('userId') userId) {
    return this.tagsService.remove(req.params.id, userId);
  }
}
