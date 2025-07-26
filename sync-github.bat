@echo off
chcp 65001 > nul
echo --- Sincronizando cambios con GitHub ---

REM Verifica si Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git no está instalado o no está en el PATH.
    echo Por favor, instala Git y asegúrate de que esté accesible desde la línea de comandos.
    echo Puedes descargarlo desde https://git-scm.com/download/win
    goto :eof
)

REM Verifica si estamos en un repositorio Git
git rev-parse --is-inside-work-tree >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: No estás en un repositorio Git.
    echo Por favor, ejecuta 'git-setup.bat' primero o navega a la raíz de tu repositorio.
    goto :eof
)

REM Agrega todos los cambios
echo Agregando todos los cambios...
git add .
if %errorlevel% neq 0 (
    echo Error al agregar los cambios.
    goto :eof
)

REM Verifica si hay cambios para commitear
git diff --cached --exit-code >nul 2>&1
if %errorlevel% equ 0 (
    echo No hay cambios para commitear.
    echo Sincronización completada (sin cambios nuevos).
    goto :eof
)

REM Pide un mensaje de commit
set /p commit_message=Introduce un mensaje para el commit (ej. 'Actualizacion de productos'): 
if "%commit_message%"=="" (
    set commit_message=Actualización automática
    echo No se introdujo mensaje, usando: %commit_message%
)

REM Realiza el commit
echo Realizando commit...
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo Error al realizar el commit.
    goto :eof
)

REM Sube los cambios a GitHub
echo Subiendo cambios a GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo Error al subir los cambios a GitHub.
    goto :eof
)

echo Sincronización con GitHub completada exitosamente.
pause