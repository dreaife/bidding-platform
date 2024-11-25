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

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 用户
  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  findOneUser(@Param('id') id: number) {
    return this.adminService.findOneUser(id);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    return this.adminService.updateUser(id, user);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.deleteUser(id);
  }

  // 项目
  @Get('projects')
  findAllProjects() {
    return this.adminService.findAllProjects();
  }

  @Get('projects/:id')
  findOneProject(@Param('id') id: number) {
    return this.adminService.findOneProject(id);
  }

  @Put('projects/:id')
  updateProject(@Param('id') id: number, @Body() project: Project) {
    return this.adminService.updateProject(id, project);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id') id: number) {
    return this.adminService.deleteProject(id);
  }

  // 投标
  @Get('bids')
  findAllBids() {
    return this.adminService.findAllBids();
  }

  @Get('bids/:id')
  findOneBid(@Param('id') id: number) {
    return this.adminService.findOneBid(id);
  }

  @Put('bids/:id')
  updateBid(@Param('id') id: number, @Body() bid: Bid) {
    return this.adminService.updateBid(id, bid);
  }

  @Delete('bids/:id')
  deleteBid(@Param('id') id: number) {
    return this.adminService.deleteBid(id);
  }
}
