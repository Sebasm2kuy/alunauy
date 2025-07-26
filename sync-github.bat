@echo off
chcp 65001 > nul
echo ========================================
echo     Sincronizar con GitHub
echo ========================================
echo.

REM Verificar si Git esta instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH
    echo Por favor instala Git desde: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Cambiar al directorio del proyecto
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

REM Crear commit con timestamp o mensaje personalizado
set /p commit_message="Introduce un mensaje para el commit (ej. 'Actualizacion de productos'): "
if "%commit_message%"=="" (
    set timestamp=%date:~-4,4%-%date:~-10,2%-%date:~-7,2% %time:~0,2%:%time:~3,2%
    set commit_message="Actualizacion ALuna - %timestamp%"
    echo No se introdujo mensaje, usando: %commit_message%
)

echo 💾 Creando commit...
git commit -m %commit_message%
if errorlevel 1 (
    echo ℹ️ No hay cambios nuevos para commitear
    echo.
    pause
    exit /b 0
)
echo.

REM Configurar rama principal (si no está ya configurada)
git branch -M main

REM Subir cambios
echo 🚀 Subiendo a GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo ⚠️ No se pudieron subir los archivos automaticamente.
    echo 💡 Comandos para diagnosticar:
    echo   git status
    echo   git remote -v
    echo   git push -v
    echo.
    echo 🔑 Si necesitas autenticarte, GitHub te pedira tus credenciales.
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