@echo off
title Deploy Portal Bem-Vindos (CFT)
echo ===================================================
echo   Iniciando o Deploy do Portal Bem-Vindos na Vercel
echo ===================================================
echo.
cd Bem-Vindos
npx vercel --prod
echo.
echo ===================================================
echo   Processo concluido!
echo ===================================================
pause
