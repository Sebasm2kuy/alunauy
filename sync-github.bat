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
git commit -m "Actualizacion ALuna - %timestamp%"
echo.

REM Subir cambios
echo 🚀 Subiendo a GitHub...
git push
if errorlevel 1 (
    echo.
    echo ⚠️ Error al subir. Intentando forzar...
    git push --force-with-lease
)

echo.
echo ✅ Sincronizacion completa!
echo 🌐 Ver sitio: https://sebasm2kuy.github.io/alunauy
echo.
pause