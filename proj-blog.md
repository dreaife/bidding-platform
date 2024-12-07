# 基于 Nest.js 和 Angular 的竞价平台

## 项目总体描述

本项目是一个基于 Nest.js 和 Angular 的竞价平台，旨在提供一个完整的竞标和管理系统。

项目的主要功能包括用户注册和登录、项目创建和管理、投标管理以及用户角色管理。项目的前端使用 Angular 框架构建，后端使用 Nest.js 框架构建，数据库使用 PostgreSQL，并通过 Swagger 提供 API 文档。

项目部署在 DigitalOcean 的 Droplet 上，前端通过 Nginx 进行部署。

```shell
前端 (Angular)
  ↓（API 请求）
Cognito (用户认证)
  ↓（验证通过后请求转发）
后端 (Nest.js)
  ↓（数据库查询）
数据库 (PostgreSQL)
  ↑（数据返回）
后端 (Nest.js)
  ↑（处理后的响应）
前端 (Angular)
```

## 项目结构

- **frontend**: 包含所有前端代码，使用 Angular 框架构建。
- **backend**: 包含所有后端代码，使用 Nest.js 框架构建。
- **.github**: 包含 GitHub Actions 的配置文件，用于持续集成和部署。

# 后端

## 后端构建

后端使用 Nest.js 框架构建，提供了一个模块化、可扩展的架构。主要功能包括用户认证、项目管理、投标管理等。后端通过 TypeORM 进行数据库操作，支持多种数据库类型。

### 后端技术栈

- **Nest.js**: 用于构建高效、可扩展的 Node.js 服务器端应用程序。
- **TypeORM**: 用于数据库交互的 ORM 框架。
- **Swagger**: 用于生成 API 文档，方便开发者查看和测试 API。

### 后端构建步骤

1. **安装依赖**: 在 `backend` 目录下运行 `npm install` 安装所有必要的依赖。
2. **配置环境变量**: 在项目根目录下创建 `.env` 文件，配置数据库连接信息和其他环境变量。
3. **运行开发服务器**: 使用 `npm run start:dev` 启动开发服务器，支持热重载。
4. **生产构建**: 使用 `npm run build` 进行生产环境构建，生成的文件位于 `dist` 目录。

### 数据库

项目使用 PostgreSQL 作为数据库，所有的数据库操作通过 TypeORM 进行。数据库初始化脚本位于 `backend/SQL/init-script.sql`，可以用于创建和初始化数据库。

后端代码结构清晰，模块化设计使得功能扩展和维护更加方便。

## 后端安全认证

后端的安全认证通过 AWS Cognito 实现，结合 Nest.js 的拦截器和服务，确保用户的身份验证和授权。

### 安全认证架构

- **AWS Cognito**: 用于用户注册、登录和身份验证。Cognito 提供了安全的用户池和身份池管理。
- **Nest.js 拦截器**: 用于拦截 HTTP 请求，验证请求头中的 JWT Token，确保用户身份的合法性。
- **Service 层**: 负责处理与 Cognito 的交互，以及将 Cognito 用户与数据库中的用户信息关联。

### 实现步骤

1. **Cognito 用户池配置**: 在 AWS Cognito 中创建用户池，并配置应用客户端以支持 JWT Token 的生成和验证。

2. **JWT 拦截器**: 在 Nest.js 中创建一个拦截器，解析请求头中的 JWT Token，验证其有效性，并将用户信息附加到请求对象中。

   ```typescript
   import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
   import { Observable } from 'rxjs';
   import { AuthService } from './auth.service';

   @Injectable()
   export class JwtInterceptor implements NestInterceptor {
     constructor(private readonly authService: AuthService) {}

     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
       const request = context.switchToHttp().getRequest();
       const token = request.headers.authorization?.split(' ')[1];

       if (!token) {
         throw new UnauthorizedException('Token not found');
       }

       const user = this.authService.validateToken(token);
       if (!user) {
         throw new UnauthorizedException('Invalid token');
       }

       request.user = user;
       return next.handle();
     }
   }
   ```

3. **用户服务**: 创建一个用户服务，负责从数据库中检索用户信息，并将其与 Cognito 用户进行关联。通过 Cognito ID 作为唯一标识符，将用户信息存储在数据库中。

   ```typescript
   import { Injectable } from '@nestjs/common';
   import { UsersRepository } from './users.repository';

   @Injectable()
   export class UsersService {
     constructor(private readonly usersRepository: UsersRepository) {}

     async findOrCreateUser(cognitoId: string, email: string) {
       let user = await this.usersRepository.findOneByCognitoId(cognitoId);
       if (!user) {
         user = await this.usersRepository.create({ cognitoId, email });
       }
       return user;
     }
   }
   ```

4. **角色和权限管理**: 在数据库中定义用户角色（如管理员、客户、投标者），并在拦截器中根据角色进行权限验证。

   ```typescript
   import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
   import { Reflector } from '@nestjs/core';

   @Injectable()
   export class RolesGuard implements CanActivate {
     constructor(private reflector: Reflector) {}

     canActivate(context: ExecutionContext): boolean {
       const roles = this.reflector.get<string[]>('roles', context.getHandler());
       if (!roles) {
         return true;
       }
       const request = context.switchToHttp().getRequest();
       const user = request.user;
       return roles.includes(user.role);
     }
   }
   ```

   在需要权限验证的 API 上添加 `@Roles('admin')` 装饰器，指定需要的角色。

   ```typescript
   @Post()
   @Roles('admin')
   createProject(@Body() createProjectDto: CreateProjectDto) {
     return this.projectsService.createProject(createProjectDto);
   }
   ```

通过这种方式，后端能够有效地管理用户身份和权限，确保系统的安全性和可靠性。

## 项目管理实现

在项目管理模块中，将展示如何通过 Controller 调用 Service，再通过 Service 与数据库交互。

### Controller

在 `ProjectsController` 中，定义处理 HTTP 请求的路由和方法。

```typescript
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsDto } from '../entities/DTO/projects.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Body() projectDto: ProjectsDto) {
    return this.projectsService.create(projectDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() projectDto: ProjectsDto) {
    return this.projectsService.update(id, projectDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.projectsService.delete(id);
  }
}
```

### Service

`ProjectsService` 负责业务逻辑处理，并与数据库进行交互。

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Project } from '../entities/projects.entity';
import { ProjectsDto } from '../entities/DTO/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private dataSource: DataSource) {}

  findAll() {
    return this.dataSource.getRepository(Project).find();
  }

  findOne(id: number) {
    return this.dataSource.getRepository(Project).findOneBy({ project_id: id });
  }

  create(project: ProjectsDto) {
    return this.dataSource.getRepository(Project).save(project);
  }

  update(id: number, project: ProjectsDto) {
    return this.dataSource.getRepository(Project).update(id, project);
  }

  delete(id: number) {
    return this.dataSource.getRepository(Project).delete(id);
  }
}
```

### 数据库实体

`Project` 实体定义了项目在数据库中的结构，通过 `@Entity()` 装饰器定义实体，通过 `@Column()` 装饰器定义列。

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  budget_min: number;

  @Column('decimal')
  budget_max: number;

  @Column('date')
  deadline: Date;

  @Column({ default: 'open' })
  status: string;
}
```

通过这种方式，Controller 负责处理 HTTP 请求，Service 负责业务逻辑，数据库实体定义数据结构，三者协同工作，实现完整的项目管理功能。

# 前端

前端使用 Angular 框架构建，提供了用户友好的界面和交互体验。主要功能包括项目展示、投标管理、用户注册和登录等。

## 前端技术栈

- **Angular**: 用于构建现代化的单页应用程序。
- **RxJS**: 用于处理异步数据流。
- **Angular CLI**: 提供了强大的开发工具和命令行接口。

## 前端构建步骤

1. **安装依赖**: 在 `frontend` 目录下运行 `npm install` 安装所有必要的依赖。
2. **开发服务器**: 使用 `ng serve` 启动开发服务器，默认在 `http://localhost:4200/` 运行。
3. **生产构建**: 使用 `ng build` 进行生产环境构建，生成的文件位于 `dist` 目录。

## 项目详情组件

前端应用由多个组件组成，每个组件负责特定的功能模块。以下是一个示例组件的实现。

`ProjectDetailComponent` 用于展示单个项目的详细信息。

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { BidsService } from '../../services/bids.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: any = null;
  bids: any[] = [];
  loading = false;
  error = '';
  userRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private bidsService: BidsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(+projectId);
      this.loadBids(+projectId);
    }
  }

  loadProject(id: number) {
    this.loading = true;
    this.projectsService.getProjectById(id).subscribe({
      next: (data) => {
        this.project = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = '加载项目详情失败';
        this.loading = false;
        console.error('加载项目详情错误:', err);
      }
    });
  }

  loadBids(projectId: number) {
    this.bidsService.getBidsByProjectId(projectId).subscribe({
      next: (data) => {
        this.bids = data;
      },
      error: (err) => {
        console.error('加载投标列表错误:', err);
      }
    });
  }
}
```

### 模板文件

`project-detail.component.html` 定义了项目详情的展示结构。

```html
<div class="project-detail">
  <div *ngIf="loading" class="loading">
    加载中...
  </div>

  <div *ngIf="error" class="error">
    {{ error }}
  </div>

  <div *ngIf="project && !loading" class="project-info">
    <h2>{{ project.title }}</h2>
    <div class="project-meta">
      <p>预算: ¥{{ project.budget_min }} - ¥{{ project.budget_max }}</p>
      <p>截止日期: {{ project.deadline | date }}</p>
      <p>状态: {{ project.status }}</p>
    </div>
    
    <div class="project-description">
      <h3>项目描述</h3>
      <p>{{ project.description }}</p>
    </div>

    <app-bid-form 
      *ngIf="userRole === 'bidder' && project.status === 'open'"
      [projectId]="project.project_id"
      (bidSubmitted)="loadBids(project.project_id)">
    </app-bid-form>

    <div class="bids-section" *ngIf="userRole === 'client' || userRole === 'admin'">
      <h3>投标列表</h3>
      <div *ngFor="let bid of bids" class="bid-card">
        <p>投标人: {{ bid.bidder_id }}</p>
        <p>投标金额: ¥{{ bid.amount }}</p>
        <p>投标说明: {{ bid.message }}</p>
        <p>状态: {{ bid.status }}</p>
      </div>
    </div>
  </div>
</div>
```

通过这种方式，前端应用能够提供丰富的用户交互和数据展示功能。

# 测试

项目使用 Jest 进行单元测试和集成测试，确保代码的正确性和稳定性。同时，使用 ESLint 进行代码质量检查，确保代码风格一致。

## Jest 测试

Jest 是一个强大的 JavaScript 测试框架，支持断言、模拟和快照测试。

### Jest 配置

在项目的 `package.json` 中配置 Jest：

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage"
},
"jest": {
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

### 示例测试

以下是一个简单的服务测试示例：

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('应该返回单个项目', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockProject);
    });
  });
});
```

## ESLint 代码质量检查

ESLint 是一个用于识别和报告 JavaScript 代码中的模式的工具，帮助开发者保持代码的一致性和质量。

### ESLint 配置

在项目根目录下创建 `.eslintrc.js` 文件：

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```

### 运行 ESLint

在 `package.json` 中添加脚本：

```json
"scripts": {
  "lint": "eslint . --ext .ts"
}
```

通过运行 `npm run lint` 来检查代码质量。

通过使用 Jest 和 ESLint，项目能够确保代码的正确性和一致性，提高开发效率和代码质量。

# CI/CD

项目使用 GitHub Actions 实现持续集成和持续部署（CI/CD），确保代码在每次提交后自动构建、测试和部署。

## GitHub Actions

GitHub Actions 是一个用于自动化软件开发工作流的工具。通过定义工作流文件，可以在代码库中自动执行构建、测试和部署任务。

### 工作流配置

在项目的 `.github/workflows/deploy.yml` 文件中定义了 CI/CD 工作流：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20.18.0'

    - name: Install dependencies
      run: |
        cd backend
        npm install
        cd ../frontend
        npm install

    - name: Run tests
      run: |
        cd backend
        npm run test:cov
        cd ../frontend
        npm run test

    - name: Lint code
      run: |
        cd backend
        npm run lint
        cd ../frontend
        npm run lint

    - name: Build project
      run: |
        cd backend
        npm run build
        cd ../frontend
        npm run build

    - name: Create Release Package
      run: |
        mkdir -p build
        cd backend
        tar -czvf ../build/backend.tar.gz dist
        cd ../frontend
        tar -czvf ../build/frontend.tar.gz dist
        cd ..

    - name: Deploy to DigitalOcean
      uses: digitalocean/action-doctl@v2
      with:
        token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      run: |
        # 部署脚本或命令
```

## 部署

- **DigitalOcean**: 项目部署在 DigitalOcean 的 Droplet 上，前端通过 Nginx 进行部署。
- **自动化流程**: 每次代码提交到 `main` 分支时，GitHub Actions 会自动执行构建、测试和部署流程。

通过这种方式，项目能够快速响应代码变更，确保每次提交的代码都经过严格的测试和验证，并自动部署到生产环境。
