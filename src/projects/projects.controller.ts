import { Controller } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { Project } from '../entities/projects.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('projects')
@UseGuards(RolesGuard)
@Roles(Role.Client)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 查询所有项目
   * @returns 所有项目
   */
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  /**
   * 查询单个项目
   * @param id 项目ID
   * @returns 项目
   */
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  /**
   * 更新项目
   * @param id 项目ID
   * @param project 项目信息
   * @returns 更新后的项目
   */
  @Put('/:id')
  update(@Param('id') id: number, @Body() project: Project) {
    return this.projectsService.update(id, project);
  }

  /**
   * 删除项目
   * @param id 项目ID
   * @returns 删除结果
   */
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.projectsService.delete(id);
  }

  /**
   * 创建项目
   * @param project 项目信息
   * @returns 创建后的项目
   */
  @Post()
  create(@Body() project: Project) {
    return this.projectsService.create(project);
  }
}
