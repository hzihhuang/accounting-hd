import { Controller, Get, Query } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetLineDto } from './dto/get-line.dto';
import { User } from '@/web/decorators/getUser.decorator';
import { GetWeeksDto } from './dto/get-weeks-dto';
import { GetMonthsDto } from './dto/get-months-dto';
import { GetBarDto } from './dto/get-bar.dto';

@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  // 金额趋势
  @Get('line')
  async getTrend(@Query() query: GetLineDto, @User('id') id: number) {
    return this.chartsService.getLine(query, id);
  }

  @Get('bar')
  async getBar(@Query() query: GetBarDto, @User('id') id: number) {
    return this.chartsService.getBar(query, id);
  }

  // 分类占比（金额）
  @Get('category')
  async getCategory(@Query() query: GetCategoryDto, @User('id') id: number) {
    return this.chartsService.getCategory(query, id);
  }

  @Get('weeks')
  async getWeeks(@Query() query: GetWeeksDto, @User('id') id: number) {
    return this.chartsService.getWeeks(query, id);
  }

  @Get('months')
  async getMonths(@Query() query: GetMonthsDto, @User('id') id: number) {
    return this.chartsService.getMonths(query, id);
  }

  @Get('years')
  async getYears(@Query() query: GetMonthsDto, @User('id') id: number) {
    return this.chartsService.getYears(query, id);
  }
}
