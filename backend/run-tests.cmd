@REM 运行测试

echo "Running ESLint..."
npm run lint

echo "Running tests with coverage..."
npm run test:cov

echo "Running Trivy scan..."
trivy fs . --format json --output ../reports/backend/trivy-results.json

@REM echo "Running SonarQube analysis..."
@REM sonar-scanner
