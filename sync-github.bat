@echo off
echo ========================================
echo     Sincronizar con GitHub
echo ========================================
echo.

cd /d "c:\alunauy-main"
if errorlevel 1 (
    echo ERROR: No se pudo acceder al directorio c:\alunauy-main
    pause
    exit /b 1
)

echo 📁 Directorio: %CD%
echo.

REM Verificar estado del repositorio
echo 📊 Estado del repositorio:
git status --porcelain
echo.

REM Agregar cambios
echo 📦 Agregando cambios...
git add .
echo.

REM Crear commit con timestamp
set timestamp=%date:~-4,4%-%date:~-10,2%-%date:~-7,2% %time:~0,2%:%time:~3,2%
git commit -m "Actualizacion ALuna - %timestamp%" 2>nul
if errorlevel 1 (
    echo ℹ️ No hay cambios nuevos para commitear
    echo.
    pause
    exit /b 0
)
echo.

REM Subir cambios
echo 🚀 Subiendo a GitHub...
git push
if errorlevel 1 (
    echo.
    echo ⚠️ Error al subir. Verifica tu conexion y credenciales.
    echo 💡 Comandos para diagnosticar:
    echo   git status
    echo   git remote -v
    echo   git push -v
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Sincronizacion completa!
echo 🌐 Sitio web: https://sebasm2kuy.github.io/alunauy
echo ⏱️ Los cambios pueden tardar 2-5 minutos en aparecer
echo.
pause