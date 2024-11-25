import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }
}
