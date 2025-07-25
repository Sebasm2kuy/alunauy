# 🔗 Configuración de Git para ALuna

## Pasos para vincular con GitHub

### 1. Instalar Git (si no lo tienes)
Descarga e instala Git desde: https://git-scm.com/download/win

### 2. Configurar Git localmente
Abre una terminal en `c:\alunauy-main` y ejecuta:

```bash
# Configurar tu identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"

# Inicializar repositorio
git init

# Agregar archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit - ALuna website"
```

### 3. Crear repositorio en GitHub
1. Ve a https://github.com
2. Haz clic en "New repository"
3. Nombra tu repositorio (ej: `aluna-cosmeticos`)
4. Marca como público
5. NO inicialices con README (ya tienes archivos)
6. Haz clic en "Create repository"

### 4. Conectar con GitHub
```bash
# Agregar remote origin (cambiar URL por la tuya)
git remote add origin https://github.com/tu-usuario/aluna-cosmeticos.git

# Cambiar a rama main
git branch -M main

# Subir archivos
git push -u origin main
```

### 5. Configurar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Settings > Pages
3. Source: "Deploy from a branch"
4. Branch: "main" / "/ (root)"
5. Save

Tu sitio estará en: `https://tu-usuario.github.io/aluna-cosmeticos`

## Comandos útiles para el futuro

```bash
# Ver estado de archivos
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de cambios"

# Subir cambios
git push

# Ver historial
git log --oneline
```

## Flujo de trabajo recomendado

1. **Hacer cambios** en tus archivos locales
2. **Probar** que todo funcione
3. **Agregar** cambios: `git add .`
4. **Commit**: `git commit -m "Descripción"`
5. **Subir**: `git push`
6. **GitHub Pages** se actualiza automáticamente

## Integración con el panel admin

El panel de administración (`/admin/`) puede configurarse para subir cambios automáticamente a GitHub usando la API. Para esto necesitarás:

1. **Personal Access Token** de GitHub
2. **Configurar** en el panel admin
3. **Usar** el botón "Subir Cambios a GitHub"

¡Tu sitio se actualizará automáticamente! 🚀