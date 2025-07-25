# 🔧 Comandos Git para ALuna

## Configuración inicial (solo una vez)

```bash
# Navegar al directorio del proyecto
cd c:\alunauy-main

# Configurar usuario
git config user.name "Sebastian"
git config user.email "sebasm2kuy@gmail.com"

# Inicializar repositorio
git init

# Agregar repositorio remoto
git remote add origin https://github.com/Sebasm2kuy/alunauy.git

# Configurar rama principal
git branch -M main
```

## Comandos diarios

### Subir cambios
```bash
# Ver estado de archivos
git status

# Agregar todos los cambios
git add .

# Crear commit con mensaje
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

### Comandos útiles
```bash
# Ver historial de commits
git log --oneline

# Ver diferencias
git diff

# Descargar cambios del repositorio
git pull

# Ver ramas
git branch

# Cambiar de rama
git checkout nombre-rama
```

## Scripts automatizados

### `git-setup.bat`
- Configuración inicial completa
- Conecta con GitHub
- Sube todos los archivos

### `sync-github.bat`
- Sincronización rápida
- Agrega, commitea y sube cambios
- Uso diario

## Solución de problemas

### Error de autenticación
```bash
# Configurar credenciales
git config --global credential.helper manager-core
```

### Forzar subida (cuidado)
```bash
git push --force-with-lease
```

### Resetear cambios locales
```bash
git reset --hard HEAD
```

## URLs importantes

- **Repositorio**: https://github.com/Sebasm2kuy/alunauy
- **Sitio web**: https://sebasm2kuy.github.io/alunauy
- **Configuración Pages**: https://github.com/Sebasm2kuy/alunauy/settings/pages

## Flujo recomendado

1. **Hacer cambios** en archivos locales
2. **Probar** que todo funcione
3. **Ejecutar** `sync-github.bat`
4. **Verificar** en el sitio web (puede tardar 2-5 minutos)

¡Tu sitio se actualizará automáticamente! 🚀