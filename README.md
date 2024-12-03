# bidding-platform

## 项目结构

- frontend: 前端项目
- backend: 后端项目
- .github: GitHub Actions 配置

## 项目依赖

- Node.js
  - version: v20.18.0
- Nest.js
  - version: 10.1.0
- Angular
  - version: 16.3.1

## 运行

- 运行后端：`run-backend.cmd`
  - 需要先在 backend 目录下运行 `npm install`
  - 运行 `npm run start` 启动后端
- 运行前端：`run-frontend.cmd`
  - 需要先在 frontend 目录下运行 `npm install`
  - 运行 `npm run start` 启动前端

## 部署

- 使用 GitHub Actions 部署到 DigitalOcean Droplet
- 在server上使用nginx部署前端

## 开发

- 使用 Angular CLI 开发前端
- 使用 Nest.js 开发后端

## 参考

- [Nest.js 文档](https://docs.nestjs.com/)
- [Angular 文档](https://angular.io/docs)
