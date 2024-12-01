import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Project } from '../entities/projects.entity';

@Injectable()
export class ProjectsService {
  constructor(private dataSource: DataSource) {}

  /**
   * 查询所有项目
   * @returns 所有项目
   */
  findAll() {
    return this.dataSource.getRepository(Project).find();
  }

  /**
   * 查询单个项目
   * @param id 项目ID
   * @returns 项目
   */
  findOne(id: number) {
    return this.dataSource.getRepository(Project).findOneBy({ project_id: id });
  }

  /**
   * 更新项目
   * @param id 项目ID
   * @param project 项目信息
   * @returns 更新后的项目
   */
  update(id: number, project: Project) {
    return this.dataSource.getRepository(Project).update(id, project);
  }

  /**
   * 删除项目
   * @param id 项目ID
   * @returns 删除结果
   */
  delete(id: number) {
    return this.dataSource.getRepository(Project).delete(id);
  }

  /**
   * 创建项目
   * @param project 项目信息
   * @returns 创建后的项目
   */
  create(project: Project) {
    return this.dataSource.getRepository(Project).save(project);
  }
}
