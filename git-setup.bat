@echo off
echo Configurando repositorio Git para ALuna...
echo.

REM Verificar si Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git no está instalado o no está en el PATH
    echo Por favor instala Git desde: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Inicializar repositorio si no existe
if not exist ".git" (
    echo Inicializando repositorio Git...
    git init
    echo.
)

REM Configurar usuario (cambiar por tus datos)
echo Configurando usuario Git...
git config user.name "Tu Nombre"
git config user.email "tu-email@ejemplo.com"
echo.

REM Agregar archivos al staging
echo Agregando archivos al repositorio...
git add .
echo.

REM Hacer commit inicial
echo Haciendo commit inicial...
git commit -m "Initial commit - ALuna website"
echo.

REM Agregar remote origin (cambiar por tu repositorio)
echo Para conectar con GitHub, ejecuta:
echo git remote add origin https://github.com/tu-usuario/tu-repositorio.git
echo git branch -M main
echo git push -u origin main
echo.

echo Configuración completada!
echo.
echo Próximos pasos:
echo 1. Crea un repositorio en GitHub
echo 2. Ejecuta los comandos mostrados arriba con tu URL de repositorio
echo 3. Configura GitHub Pages en tu repositorio
echo.
pause