import { Body, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { WebController } from '@/web/WebController';
import { GetTagDto } from './dto/get-tag.dto';
import { BatchRemoveTagDto, RemoveTagDto } from './dto/remove-tag.dto';

@WebController('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getTags(@Query() getTagDto: GetTagDto) {
    return this.tagsService.getTags(getTagDto);
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Delete(':id')
  async remove(@Param() removeTagDto: RemoveTagDto) {
    return this.tagsService.remove(removeTagDto.id);
  }

  @Post('batch')
  async removeAll(@Body() batchRemoveDto: BatchRemoveTagDto) {
    return this.tagsService.batchRemove(batchRemoveDto.ids);
  }
}
