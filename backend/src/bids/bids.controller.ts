import { Controller, Logger } from '@nestjs/common';
import { BidsService } from './bids.service';
import { Get, Param, Put, Body, Post } from '@nestjs/common';
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
  private logger = new Logger('BidsController');
  constructor(private readonly bidsService: BidsService) {}

  @Get()
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '获取所有投标' })
  findAll() {
    this.logger.log('bids findAll');
    return this.bidsService.findAll();
  }

  @Get('/:id')
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '获取单个投标' })
  findOne(@Param('id') id: number) {
    this.logger.log(`bids findOne by id: ${id}`);
    return this.bidsService.findOne(id);
  }

  @Put('/:id')
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '更新投标' })
  update(@Param('id') id: number, @Body() bid: Bid) {
    this.logger.log(
      `bids update by id: ${id} with body: ${JSON.stringify(bid)}`,
    );
    return this.bidsService.update(id, bid);
  }

  @Post()
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '创建投标' })
  create(@Body() bid: Bid) {
    this.logger.log(`bids create with body: ${JSON.stringify(bid)}`);
    return this.bidsService.create(bid);
  }

  @Get('/project/:id')
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '根据项目ID获取投标' })
  findByProjectId(@Param('id') id: number) {
    this.logger.log(`bids findByProjectId by id: ${id}`);
    return this.bidsService.findByProjectId(id);
  }

  @Put('/:id/accept')
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  @ApiOperation({ summary: '更新投标状态' })
  acceptBid(@Param('id') id: number, @Body() body: { status: string }) {
    this.logger.log(
      `bids acceptBid by id: ${id} with body: ${JSON.stringify(body)}`,
    );
    return this.bidsService.updateStatus(id, body.status);
  }

  @Get('/:id/name')
  @ApiOperation({ summary: '获取投标人姓名' })
  @Roles(Role.Bidder, Role.Client, Role.Admin)
  getBidUserName(@Param('id') id: number) {
    this.logger.log(`bids getBidUserName by id: ${id}`);
    return this.bidsService.getBidUserName(id);
  }
}
