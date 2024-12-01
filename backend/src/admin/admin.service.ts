import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/users.entity';
import { Project } from '../entities/projects.entity';
import { Bid } from '../entities/bids.entity';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

  /**
   * 查询所有用户
   * @returns 所有用户
   */
  findAllUsers() {
    return this.dataSource.getRepository(User).find();
  }

  /**
   * 查询单个用户
   * @param id 用户ID
   * @returns 用户
   */
  findOneUser(id: number) {
    return this.dataSource.getRepository(User).findOneBy({ user_id: id });
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param user 用户信息
   * @returns 更新后的用户
   */
  updateUser(id: number, user: User) {
    return this.dataSource.getRepository(User).update(id, user);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   */
  deleteUser(id: number) {
    return this.dataSource.getRepository(User).delete(id);
  }

  /**
   * 查询所有项目
   * @returns 所有项目
   */
  findAllProjects() {
    return this.dataSource.getRepository(Project).find();
  }

  /**
   * 查询单个项目
   * @param id 项目ID
   * @returns 项目
   */
  findOneProject(id: number) {
    return this.dataSource.getRepository(Project).findOneBy({ project_id: id });
  }

  /**
   * 更新项目
   * @param id 项目ID
   * @param project 项目信息
   * @returns 更新后的项目
   */
  updateProject(id: number, project: Project) {
    return this.dataSource.getRepository(Project).update(id, project);
  }

  /**
   * 删除项目
   * @param id 项目ID
   * @returns 删除结果
   */
  deleteProject(id: number) {
    return this.dataSource.getRepository(Project).delete(id);
  }

  /**
   * 查询所有投标
   * @returns 所有投标
   */
  findAllBids() {
    return this.dataSource.getRepository(Bid).find();
  }

  /**
   * 查询单个投标
   * @param id 投标ID
   * @returns 投标
   */
  findOneBid(id: number) {
    return this.dataSource.getRepository(Bid).findOneBy({ bid_id: id });
  }

  /**
   * 更新投标
   * @param id 投标ID
   * @param bid 投标信息
   * @returns 更新后的投标
   */
  updateBid(id: number, bid: Bid) {
    return this.dataSource.getRepository(Bid).update(id, bid);
  }

  /**
   * 删除投标
   * @param id 投标ID
   * @returns 删除结果
   */
  deleteBid(id: number) {
    return this.dataSource.getRepository(Bid).delete(id);
  }
}
