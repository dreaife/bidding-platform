@echo off
if not exist "package.json" cd backend

call npm install

echo "Starting backend..."
call npm run start
