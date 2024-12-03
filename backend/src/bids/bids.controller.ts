import { Controller } from '@nestjs/common';
import { BidsService } from './bids.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { Bid } from '../entities/bids.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Bids')
@Controller('bids')
@UseGuards(RolesGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get()
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '获取所有投标' })
  findAll() {
    return this.bidsService.findAll();
  }

  @Get('/:id')
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '获取单个投标' })
  findOne(@Param('id') id: number) {
    return this.bidsService.findOne(id);
  }

  @Put('/:id')
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '更新投标' })
  update(@Param('id') id: number, @Body() bid: Bid) {
    return this.bidsService.update(id, bid);
  }

  @Post()
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '创建投标' })
  create(@Body() bid: Bid) {
    return this.bidsService.create(bid);
  }

  @Get('/project/:id')
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '根据项目ID获取投标' })
  findByProjectId(@Param('id') id: number) {
    return this.bidsService.findByProjectId(id);
  }
}
