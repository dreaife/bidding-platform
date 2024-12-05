import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { DataSource } from 'typeorm';
import { ProjectsDto } from '../entities/DTO/projects.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockRepositoryFunctions;

  const mockProject = {
    project_id: 1,
    title: '测试项目',
    description: '这是一个测试项目',
    budget_min: 1000,
    budget_max: 5000,
    deadline: new Date(),
    status: 'open',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mockRepositoryFunctions = {
      find: jest.fn().mockResolvedValue([mockProject]),
      findOneBy: jest.fn().mockResolvedValue(mockProject),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      save: jest.fn().mockResolvedValue(mockProject),
    };

    const mockDataSource = {
      getRepository: jest.fn(() => mockRepositoryFunctions),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('应该返回所有项目', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockProject]);
      expect(mockRepositoryFunctions.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('应该返回单个项目', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockProject);
      expect(mockRepositoryFunctions.findOneBy).toHaveBeenCalledWith({
        project_id: 1,
      });
    });
  });

  describe('create', () => {
    it('应该创建并返回新项目', async () => {
      const projectDto: ProjectsDto = {
        title: '测试项目',
        description: '这是一个测试项目',
        budget_min: 1000,
        budget_max: 5000,
        deadline: new Date(),
      };

      const result = await service.create(projectDto);
      expect(result).toEqual(mockProject);
      expect(mockRepositoryFunctions.save).toHaveBeenCalledWith(projectDto);
    });
  });

  describe('update', () => {
    it('应该更新项目', async () => {
      const projectDto: ProjectsDto = {
        title: '更新的测试项目',
        description: '这是一个更新的测试项目',
        budget_min: 2000,
        budget_max: 6000,
        deadline: new Date(),
      };

      const result = await service.update(1, projectDto);
      expect(result).toEqual({ affected: 1 });
      expect(mockRepositoryFunctions.update).toHaveBeenCalledWith(
        1,
        projectDto,
      );
    });
  });

  describe('delete', () => {
    it('应该删除项目', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockRepositoryFunctions.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getOpenProjects', () => {
    it('应该返回所有公开项目', async () => {
      const result = await service.getOpenProjects();
      expect(result).toEqual([mockProject]);
      expect(mockRepositoryFunctions.find).toHaveBeenCalledWith({
        where: { status: 'open' },
      });
    });
  });

  describe('completeProject', () => {
    it('应该完成项目', async () => {
      const result = await service.completeProject(1);
      expect(result).toEqual({ affected: 1 });
      expect(mockRepositoryFunctions.update).toHaveBeenCalledWith(1, {
        status: 'completed',
      });
    });
  });
});
