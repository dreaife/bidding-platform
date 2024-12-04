import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * 查询所有用户
   * @returns 用户列表
   */
  findAll() {
    return this.dataSource.getRepository(User).find();
  }

  /**
   * 查询单个用户
   * @param id 用户ID
   * @returns 用户
   */
  findOne(id: number) {
    // console.log(' findOne', id);
    return this.dataSource.getRepository(User).findOneBy({ user_id: id });
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param user 用户信息
   * @returns 更新后的用户
   */
  update(id: number, user: User) {
    return this.dataSource.getRepository(User).update(id, user);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 删除结果
   */
  delete(id: number) {
    return this.dataSource.getRepository(User).delete(id);
  }

  /**
   * 创建用户
   * @param user 用户信息
   * @returns 创建后的用户
   */
  create(user: User) {
    return this.dataSource.getRepository(User).save(user);
  }

  /**
   * 查询用户名
   * @param id 用户ID
   * @returns 用户名
   */
  getName(id: number) {
    return this.dataSource.getRepository(User).findOneBy({ user_id: id });
  }
}
