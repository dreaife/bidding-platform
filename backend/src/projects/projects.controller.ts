import { Controller, Logger } from '@nestjs/common'; 
import { ProjectsService } from './projects.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { Project } from '../entities/projects.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {ProjectsDto}  from '../entities/DTO/projects.dto'

@Controller('projects')
@UseGuards(RolesGuard)
@Roles(Role.Client, Role.Admin)
@ApiTags('Projects')
export class ProjectsController {
  private logger = new Logger('ProjectsController');
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 查询所有项目
   * @returns 所有项目
   */
  @Get()
  @ApiOperation({ summary: '查询所有项目' })
  findAll() {
    this.logger.log('projects findAll');
    return this.projectsService.findAll();
  }

  /**
   * 查询单个项目
   * @param id 项目ID
   * @returns 项目
   */
  @Get('/:id')
  @ApiOperation({ summary: '查询单个项目' })
  findOne(@Param('id') id: number) {
    this.logger.log('projects findOne', id);
    return this.projectsService.findOne(id);
  }

  /**
   * 更新项目
   * @param id 项目ID
   * @param project 项目信息
   * @returns 更新后的项目
   */
  @Put('/:id')
  @ApiOperation({ summary: '更新项目' })
  update(@Param('id') id: number, @Body() projectDto: ProjectsDto) {
    this.logger.log('projects update', id, projectDto);
    return this.projectsService.update(id, projectDto);
  }

  /**
   * 删除项目
   * @param id 项目ID
   * @returns 删除结果
   */
  @Delete('/:id')
  @ApiOperation({ summary: '删除项目' })
  delete(@Param('id') id: number) {
    this.logger.log('projects delete', id);
    return this.projectsService.delete(id);
  }

  /**
   * 创建项目
   * @param project 项目信息
   * @returns 创建后的项目
   */
  @Post()
  @ApiOperation({ summary: '创建项目' })
  create(@Body() projectDto: ProjectsDto) {
    this.logger.log('projects create', projectDto);
    return this.projectsService.create(projectDto);
  }

  @Get('/open')
  @ApiOperation({ summary: '查询所有公开项目' })
  getOpenProjects() {
    this.logger.log('projects getOpenProjects');
    return this.projectsService.getOpenProjects();
  }

  @Put('/:id/complete')
  @ApiOperation({ summary: '完成项目' })
  completeProject(@Param('id') id: number) {
    this.logger.log('projects completeProject', id);
    return this.projectsService.completeProject(id);
  }
}
