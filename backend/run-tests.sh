#!/bin/bash

# 运行 ESLint
echo "Running ESLint..."
npm run lint

# 运行单元测试和生成覆盖率报告
echo "Running tests with coverage..."
npm run test:cov

# 运行 Trivy 扫描
echo "Running Trivy scan..."
trivy fs . --format json --output ../reports/backend/trivy-results.json

# # 运行 SonarQube 分析
# echo "Running SonarQube analysis..."
# sonar-scanner
