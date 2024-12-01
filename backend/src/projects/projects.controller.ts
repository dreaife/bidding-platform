import { Controller } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Get, Param, Put, Delete, Body, Post } from '@nestjs/common';
import { Project } from '../entities/projects.entity';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@Controller('projects')
@UseGuards(RolesGuard)
@Roles(Role.Client)
@ApiTags('Projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * 查询所有项目
   * @returns 所有项目
   */
  @Get()
  @ApiOperation({ summary: '查询所有项目' })
  findAll() {
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
  update(@Param('id') id: number, @Body() project: Project) {
    return this.projectsService.update(id, project);
  }

  /**
   * 删除项目
   * @param id 项目ID
   * @returns 删除结果
   */
  @Delete('/:id')
  @ApiOperation({ summary: '删除项目' })
  delete(@Param('id') id: number) {
    return this.projectsService.delete(id);
  }

  /**
   * 创建项目
   * @param project 项目信息
   * @returns 创建后的项目
   */
  @Post()
  @ApiOperation({ summary: '创建项目' })
  create(@Body() project: Project) {
    return this.projectsService.create(project);
  }
}
