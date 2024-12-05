import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Get, Param, Put, Delete, Body } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { Project } from '../entities/projects.entity';
import { Bid } from '../entities/bids.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(Role.Admin)
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private logger = new Logger('AdminController');

  // 用户
  @Get('users')
  @ApiOperation({ summary: '获取所有用户' })
  findAllUsers() {
    this.logger.log('admin findAllUsers');
    return this.adminService.findAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: '获取单个用户' })
  findOneUser(@Param('id') id: number) {
    this.logger.log(`admin findOneUser by id: ${id}`);
    return this.adminService.findOneUser(id);
  }

  @Put('users/:id')
  @ApiOperation({ summary: '更新用户' })
  updateUser(@Param('id') id: number, @Body() user: User) {
    this.logger.log(
      `admin updateUser by id: ${id} with body: ${JSON.stringify(user)}`,
    );
    return this.adminService.updateUser(id, user);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: '删除用户' })
  deleteUser(@Param('id') id: number) {
    this.logger.log(`admin deleteUser by id: ${id}`);
    return this.adminService.deleteUser(id);
  }

  // 项目
  @Get('projects')
  @ApiOperation({ summary: '获取所有项目' })
  findAllProjects() {
    this.logger.log('admin findAllProjects');
    return this.adminService.findAllProjects();
  }

  @Get('projects/:id')
  @ApiOperation({ summary: '获取单个项目' })
  findOneProject(@Param('id') id: number) {
    this.logger.log(`admin findOneProject by id: ${id}`);
    return this.adminService.findOneProject(id);
  }

  @Put('projects/:id')
  @ApiOperation({ summary: '更新项目' })
  updateProject(@Param('id') id: number, @Body() project: Project) {
    this.logger.log(
      `admin updateProject by id: ${id} with body: ${JSON.stringify(project)}`,
    );
    return this.adminService.updateProject(id, project);
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: '删除项目' })
  deleteProject(@Param('id') id: number) {
    this.logger.log(`admin deleteProject by id: ${id}`);
    return this.adminService.deleteProject(id);
  }

  // 投标
  @Get('bids')
  @ApiOperation({ summary: '获取所有投标' })
  findAllBids() {
    this.logger.log('admin findAllBids');
    return this.adminService.findAllBids();
  }

  @Get('bids/:id')
  @ApiOperation({ summary: '获取单个投标' })
  findOneBid(@Param('id') id: number) {
    this.logger.log(`admin findOneBid by id: ${id}`);
    return this.adminService.findOneBid(id);
  }

  @Put('bids/:id')
  @ApiOperation({ summary: '更新投标' })
  updateBid(@Param('id') id: number, @Body() bid: Bid) {
    this.logger.log(
      `admin updateBid by id: ${id} with body: ${JSON.stringify(bid)}`,
    );
    return this.adminService.updateBid(id, bid);
  }

  @Delete('bids/:id')
  @ApiOperation({ summary: '删除投标' })
  deleteBid(@Param('id') id: number) {
    this.logger.log(`admin deleteBid by id: ${id}`);
    return this.adminService.deleteBid(id);
  }
}
