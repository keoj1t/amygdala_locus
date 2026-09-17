@echo off
setlocal
cd /d "%~dp0"
title Locus — development server

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was not found. Install the current LTS release from https://nodejs.org/
  pause
  exit /b 1
)

echo.
echo [1/3] Checking project dependencies...
call npm install
if errorlevel 1 goto :error

echo [2/3] Checking that the development port is free...
netstat -ano | findstr /r /c:":3000 .*LISTENING" >nul
if not errorlevel 1 (
  echo.
  echo Port 3000 is already in use by another process.
  echo Stop the old Locus server first, then run this file again.
  pause
  exit /b 1
)

echo [3/3] Starting Locus...
echo.
echo Open http://localhost:3000 after the server says Ready.
echo Keep this window open while using the site. Press Ctrl+C to stop it.
echo.
call npm run dev -- --port 3000
goto :end

:error
echo.
echo The server could not start. Check the message above.
pause
exit /b 1

:end
endlocal
