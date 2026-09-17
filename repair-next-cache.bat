@echo off
setlocal
cd /d "%~dp0"
title Locus - repair Next.js cache

echo Close every Locus / Next.js terminal window before continuing.
echo.
netstat -ano | findstr /r /c:":3000 .*LISTENING" /c:":3001 .*LISTENING" >nul
if not errorlevel 1 (
  echo A development server is still running on port 3000 or 3001.
  echo Stop it with Ctrl+C, then run this repair file again.
  pause
  exit /b 1
)

echo Removing only this project's temporary .next cache...
if exist ".next" rmdir /s /q ".next"
echo Done. Now run start-locus.bat.
pause
endlocal
