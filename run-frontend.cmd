@echo off
if not exist "package.json" cd frontend

call npm install

echo "Starting frontend..."
call npm run start
