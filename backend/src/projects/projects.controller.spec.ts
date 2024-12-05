import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { ProjectsDto } from '../entities/DTO/projects.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

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

  const mockProjectsService = {
    findAll: jest.fn().mockResolvedValue([mockProject]),
    findOne: jest.fn().mockResolvedValue(mockProject),
    create: jest.fn().mockResolvedValue(mockProject),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    getOpenProjects: jest.fn().mockResolvedValue([mockProject]),
    completeProject: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        RolesGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('应该返回所有项目', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockProject]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('应该返回单个项目', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockProject);
      expect(service.findOne).toHaveBeenCalledWith(1);
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

      const result = await controller.create(projectDto);
      expect(result).toEqual(mockProject);
      expect(service.create).toHaveBeenCalledWith(projectDto);
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

      const result = await controller.update(1, projectDto);
      expect(result).toEqual({ affected: 1 });
      expect(service.update).toHaveBeenCalledWith(1, projectDto);
    });
  });

  describe('delete', () => {
    it('应该删除项目', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual({ affected: 1 });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getOpenProjects', () => {
    it('应该返回所有公开项目', async () => {
      const result = await controller.getOpenProjects();
      expect(result).toEqual([mockProject]);
      expect(service.getOpenProjects).toHaveBeenCalled();
    });
  });

  describe('completeProject', () => {
    it('应该完成项目', async () => {
      const result = await controller.completeProject(1);
      expect(result).toEqual({ affected: 1 });
      expect(service.completeProject).toHaveBeenCalledWith(1);
    });
  });
});
