@echo off
chcp 65001 > nul
echo --- Configuración inicial de Git ---

REM Verifica si Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git no está instalado o no está en el PATH.
    echo Por favor, instala Git y asegúrate de que esté accesible desde la línea de comandos.
    echo Puedes descargarlo desde https://git-scm.com/download/win
    goto :eof
)

REM Inicializa el repositorio Git si no existe
if not exist .git (
    echo Inicializando repositorio Git...
    git init
    if %errorlevel% neq 0 (
        echo Error al inicializar el repositorio Git.
        goto :eof
    )
) else (
    echo Repositorio Git ya inicializado.
)

REM Configura el remoto 'origin'
echo Configurando el remoto 'origin'...
git remote add origin https://github.com/sebasm2kuy/alunauy.git
if %errorlevel% neq 0 (
    echo Advertencia: El remoto 'origin' ya podría existir o hubo un error al agregarlo.
    echo Intentando actualizar el remoto 'origin'...
    git remote set-url origin https://github.com/sebasm2kuy/alunauy.git
    if %errorlevel% neq 0 (
        echo Error al configurar/actualizar el remoto 'origin'.
        goto :eof
    )
)

echo Configuración de Git completada.
echo Puedes verificar la configuración con: git remote -v
pause