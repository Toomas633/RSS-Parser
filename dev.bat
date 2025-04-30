@echo off
REM Reload GPG agent
gpg-connect-agent reloadagent /bye

REM Start backend dev server
cd backend
start cmd /k "npm run dev"
cd ..

REM Start frontend dev server
cd frontend
start cmd /k "npm run dev"
cd ..