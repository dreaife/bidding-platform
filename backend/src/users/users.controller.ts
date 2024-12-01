import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@Controller('users')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: '查询单个用户' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id') id: number, @Body() user: User) {
    return this.usersService.update(id, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除用户' })
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  create(@Body() user: User) {
    return this.usersService.create(user);
  }
}
