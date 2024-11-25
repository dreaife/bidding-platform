import { Controller } from '@nestjs/common';
import { BidsService } from './bids.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { Bid } from '../entities/bids.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('bids')
@UseGuards(RolesGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.bidsService.findOne(id);
  }

  @Put('/:id')
  @Roles(Role.Bidder)
  update(@Param('id') id: number, @Body() bid: Bid) {
    return this.bidsService.update(id, bid);
  }

  @Post()
  @Roles(Role.Bidder)
  create(@Body() bid: Bid) {
    return this.bidsService.create(bid);
  }

  @Get('/project/:id')
  findByProjectId(@Param('id') id: number) {
    return this.bidsService.findByProjectId(id);
  }
}
