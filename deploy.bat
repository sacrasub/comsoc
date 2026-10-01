@echo off
title Deploy ComSoc
echo ===================================================
echo   Iniciando o Deploy do ComSoc na Vercel (Producao)
echo ===================================================
echo.
npx vercel --prod
echo.
echo ===================================================
echo   Processo concluido!
echo ===================================================
pause
