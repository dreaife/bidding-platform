import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { Project } from '../entities/projects.entity';
import { Bid } from '../entities/bids.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 用户
  @Get('users')
  @ApiOperation({ summary: '获取所有用户' })
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: '获取单个用户' })
  findOneUser(@Param('id') id: number) {
    return this.adminService.findOneUser(id);
  }

  @Put('users/:id')
  @ApiOperation({ summary: '更新用户' })
  updateUser(@Param('id') id: number, @Body() user: User) {
    return this.adminService.updateUser(id, user);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: '删除用户' })
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  // 项目
  @Get('projects')
  @ApiOperation({ summary: '获取所有项目' })
  findAllProjects() {
    return this.adminService.findAllProjects();
  }

  @Get('projects/:id')
  @ApiOperation({ summary: '获取单个项目' })
  findOneProject(@Param('id') id: number) {
    return this.adminService.findOneProject(id);
  }

  @Put('projects/:id')
  @ApiOperation({ summary: '更新项目' })
  updateProject(@Param('id') id: number, @Body() project: Project) {
    return this.adminService.updateProject(id, project);
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: '删除项目' })
  deleteProject(@Param('id') id: number) {
    return this.adminService.deleteProject(id);
  }

  // 投标
  @Get('bids')
  @ApiOperation({ summary: '获取所有投标' })
  findAllBids() {
    return this.adminService.findAllBids();
  }

  @Get('bids/:id')
  @ApiOperation({ summary: '获取单个投标' })
  findOneBid(@Param('id') id: number) {
    return this.adminService.findOneBid(id);
  }

  @Put('bids/:id')
  @ApiOperation({ summary: '更新投标' })
  updateBid(@Param('id') id: number, @Body() bid: Bid) {
    return this.adminService.updateBid(id, bid);
  }

  @Delete('bids/:id')
  @ApiOperation({ summary: '删除投标' })
  deleteBid(@Param('id') id: number) {
    return this.adminService.deleteBid(id);
  }
}
