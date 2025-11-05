import { Get, Query } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetTrendDto } from './dto/get-trend.dto';
import { WebController } from '@/web/WebController';
import { GetUser } from '@/web/decorators/getUser.decorator';

@WebController('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  // 分类占比（金额）
  @Get('category')
  async getCategory(@Query() query: GetCategoryDto, @GetUser('id') id: number) {
    return this.chartsService.getCategory(query, id);
  }

  // 金额趋势
  @Get('trend')
  async getTrend(@Query() query: GetTrendDto, @GetUser('id') id: number) {
    return this.chartsService.getTrend(query, id);
  }
}
