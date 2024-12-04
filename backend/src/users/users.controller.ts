import { Controller, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { Get, Param, Put, Delete, Body, Post, Request, Headers } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Project } from '../entities/projects.entity';
import { Bid } from '../entities/bids.entity';
import { AuthService } from '../auth/auth.service';

@Controller('users')
@UseGuards(RolesGuard)
@ApiTags('Users')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  // user profile
  @Post('/profile')
  @ApiOperation({ summary: '获取当前用户信息' })
  @Roles(Role.Admin, Role.Client, Role.Bidder)
  async getCurrentUser(@Body('userId') userId: number) {
    this.logger.log(`users getCurrentUser by id: ${userId}`);
    return this.usersService.findOne(userId);
  }

  @Post('/profile/projects')
  @ApiOperation({ summary: '获取当前用户的项目' })
  @Roles(Role.Client, Role.Admin)
  async getUserProjects(@Body('userId') userId: number): Promise<Project[]> {
    this.logger.log(`users getUserProjects by id: ${userId}`);
    return this.usersService.findUserProjects(userId);
  }

  @Post('/profile/bids')
  @ApiOperation({ summary: '获取当前用户的投标' })
  @Roles(Role.Bidder, Role.Admin)
  async getUserBids(@Body('userId') userId: number): Promise<Bid[]> {
    this.logger.log(`users getUserBids by id: ${userId}`);
    return this.usersService.findUserBids(userId);
  }

  @Put('/profile')
  @ApiOperation({ summary: '更新当前用户信息' })
  @Roles(Role.Admin, Role.Client, Role.Bidder)
  async updateProfile(
    @Body('userId') userId: number,
    @Body() updateData: Partial<User>
  ): Promise<Partial<User>> {
    this.logger.log(`users updateProfile by id: ${userId} with body: ${JSON.stringify(updateData)}`);
    return this.usersService.updateProfile(userId, updateData);
  }

  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  @Roles(Role.Admin)
  findAll() {
    this.logger.log('users findAll');
    return this.usersService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: '查询单个用户' })
  @Roles(Role.Admin)
  findOne(@Param('id') id: number) {
    this.logger.log(`users findOne by id: ${id}`);
    return this.usersService.findOne(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新用户' })
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() user: User) {
    this.logger.log(`users update by id: ${id} with body: ${JSON.stringify(user)}`);
    return this.usersService.update(id, user);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除用户' })
  @Roles(Role.Admin)
  delete(@Param('id') id: number) {
    this.logger.log(`users delete by id: ${id}`);
    return this.usersService.delete(id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @Roles(Role.Admin)
  create(@Body() user: User) {
    this.logger.log(`users create with body: ${JSON.stringify(user)}`);
    return this.usersService.create(user);
  }

  @Get('/:id/name')
  @ApiOperation({ summary: '查询用户名' })
  @Roles(Role.Admin)
  getName(@Param('id') id: number) {
    this.logger.log(`users getName by id: ${id}`);
    return this.usersService.getName(id);
  }

}
