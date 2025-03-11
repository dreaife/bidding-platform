# 🚀 Bidding Platform - 基于 Nest.js 和 Angular 的竞价平台


[English](https://github.com/dreaife/bidding-platform/blob/master/README.md) | [简体中文](https://github.com/dreaife/bidding-platform/blob/master/README_zh_CN.md)


欢迎来到 **Bidding Platform**！这是一个功能强大的竞价平台，基于 **Nest.js** 和 **Angular** 构建，旨在为用户提供高效、安全的竞标和管理体验。

---

## 🌟 项目概述

本项目是一个完整的竞价平台，支持以下核心功能：

• **登录/注册**：与 **AWS Cognito** 集成，使用 Cognito 的 Token 进行 API 请求。  
• **竞价管理**：用户可以创建、查看和管理竞标项目。  
• **用户管理**：支持用户角色管理，包括管理员、客户和投标者。  
• **竞标管理**：用户可以提交竞标，查看竞标状态。  

项目部署在 **DigitalOcean** 的 Droplet 上，前端通过 **Nginx** 部署。

---

## 🌐 项目地址

• **项目部署地址**: [https://bidding-platform.server.digocean.dreaife.tokyo](https://bidding-platform.server.digocean.dreaife.tokyo)  
• **API 文档地址**: [https://bidding-platform.server.digocean.dreaife.tokyo/swagger](https://bidding-platform.server.digocean.dreaife.tokyo/swagger)  

---

## 📂 项目结构

• **`frontend`**: 前端项目，使用 **Angular** 构建。  
• **`backend`**: 后端项目，使用 **Nest.js** 构建。  
• **`.github`**: 包含 **GitHub Actions** 的配置文件，用于持续集成和部署。  

---

## 📦 项目依赖

• **Node.js**: v20.18.0  
• **Nest.js**: v10.1.0  
• **Angular**: v16.3.1  

---

## 🛠 运行项目

### 后端
1. 进入 `backend` 目录，运行以下命令：
   ```bash
   npm install
   npm run start
   ```

### 前端
1. 进入 `frontend` 目录，运行以下命令：
   ```bash
   npm install
   npm run start
   ```

---

## 🚀 部署

项目使用 **GitHub Actions** 自动部署到 **DigitalOcean Droplet**。在服务器上，使用 **Nginx** 部署前端。

---

## 💻 开发

• **前端开发**: 使用 **Angular CLI** 进行开发。  
• **后端开发**: 使用 **Nest.js** 进行开发。  

---

## 🧪 测试

• **后端测试**: 使用 **Jest** 进行单元测试和集成测试。  
• **前端测试**: 使用 **Jest** 进行单元测试。  

---

## 📚 参考文档

• **Nest.js 文档**: [https://docs.nestjs.com/](https://docs.nestjs.com/)  
• **Angular 文档**: [https://angular.io/docs](https://angular.io/docs)  

---

## 📜 许可证

本项目遵循 **MIT 许可证**。详情请参阅 [LICENSE](LICENSE)。

---

## 📢 联系与支持

• **GitHub 问题**: [报告问题](https://github.com/dreaife/bidding-platform/issues)  
• **作者**: [dreaife](https://github.com/dreaife)  

---

🌟 **如果你喜欢这个项目，请给它一个 ⭐！祝编码愉快！** 🚀