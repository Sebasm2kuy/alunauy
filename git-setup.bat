@echo off
echo ========================================
echo    Configuracion Git para ALuna
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

echo ✅ Git detectado correctamente
echo.

REM Cambiar al directorio del proyecto
cd /d "c:\alunauy-main"
if errorlevel 1 (
    echo ERROR: No se pudo acceder al directorio c:\alunauy-main
    echo Verifica que la carpeta existe
    pause
    exit /b 1
)

echo 📁 Directorio actual: %CD%
echo.

REM Configurar usuario Git (cambiar por tus datos)
echo 👤 Configurando usuario Git...
git config user.name "Sebastian"
git config user.email "sebasm2kuy@gmail.com"
git config --global init.defaultBranch main
echo.

REM Inicializar repositorio si no existe
if not exist ".git" (
    echo 🔧 Inicializando repositorio Git...
    git init
    echo.
) else (
    echo ℹ️ Repositorio Git ya existe
    echo.
)

REM Agregar remote origin
echo 🔗 Configurando repositorio remoto...
git remote remove origin 2>nul
git remote add origin https://github.com/Sebasm2kuy/alunauy.git
echo.

REM Verificar conexion con GitHub
echo 🌐 Verificando conexion con GitHub...
git fetch origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️ No se pudo conectar con GitHub. Verifica:
    echo   - Tu conexion a internet
    echo   - Que el repositorio existe y es accesible
    echo   - Tus credenciales de GitHub
    echo.
    echo 💡 Continuando con la configuracion local...
)

echo ✅ Configuracion de repositorio remoto completada
echo.

REM Agregar todos los archivos
echo 📦 Agregando archivos al repositorio...
git add .
echo.

REM Hacer commit
echo 💾 Creando commit...
git commit -m "Actualizacion completa del sitio ALuna - %date% %time%"
echo.

REM Configurar rama principal
echo 🌿 Configurando rama principal...
git branch -M main
echo.

REM Subir cambios
echo 🚀 Subiendo cambios a GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo ⚠️ No se pudieron subir los archivos automaticamente.
    echo 💡 Ejecuta manualmente estos comandos:
    echo.
    echo   git remote -v
    echo   git push -u origin main
    echo.
    echo 🔑 Si necesitas autenticarte, GitHub te pedira tus credenciales.
    echo.
) else (
    echo ✅ Archivos subidos exitosamente!
)

echo.
echo ========================================
echo        ✅ CONFIGURACION COMPLETA
echo ========================================
echo.
echo 🎉 Tu repositorio ha sido configurado exitosamente!
echo.
echo 📍 Repositorio local: c:\alunauy-main
echo 🌐 Repositorio remoto: https://github.com/Sebasm2kuy/alunauy
echo 🌍 Sitio web: https://sebasm2kuy.github.io/alunauy
echo.
echo 🔧 Proximos pasos:
echo   1. Verifica que GitHub Pages este activado
echo   2. Usa el panel admin para gestionar productos
echo   3. Los cambios se sincronizaran automaticamente
echo.
echo 📝 Para sincronizar cambios manualmente:
echo   Ejecuta: sync-github.bat
echo.
pause