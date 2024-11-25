import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Bid } from '../entities/bids.entity';
import { Equal } from 'typeorm';

@Injectable()
export class BidsService {
  constructor(private dataSource: DataSource) {}

  /**
   * 查询所有投标
   * @returns 所有投标
   */
  findAll() {
    return this.dataSource.getRepository(Bid).find();
  }

  /**
   * 查询单个投标
   * @param id 投标ID
   * @returns 投标
   */
  findOne(id: number) {
    return this.dataSource.getRepository(Bid).findOneBy({ bid_id: id });
  }

  /**
   * 更新投标
   * @param id 投标ID
   * @param bid 投标信息
   * @returns 更新后的投标
   */
  update(id: number, bid: Bid) {
    return this.dataSource.getRepository(Bid).update(id, bid);
  }

  /**
   * 删除投标
   * @param id 投标ID
   * @returns 删除结果
   */
  delete(id: number) {
    return this.dataSource.getRepository(Bid).delete(id);
  }

  /**
   * 创建投标
   * @param bid 投标信息
   * @returns 创建后的投标
   */
  create(bid: Bid) {
    return this.dataSource.getRepository(Bid).save(bid);
  }

  /**
   * 根据项目ID查询投标
   * @param projectId 项目ID
   * @returns 投标
   */
  findByProjectId(projectId: number) {
    return this.dataSource.getRepository(Bid).findBy({ project_id: Equal(projectId) });
  }
}
