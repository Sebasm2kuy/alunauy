# 🚀 Instrucciones de Despliegue - GitHub Pages

## Pasos para publicar tu sitio ALuna en GitHub Pages

### 1. Crear repositorio en GitHub
1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en "New repository" (botón verde)
3. Nombra tu repositorio: `alunauy`
4. Marca como **público** (GitHub Pages gratis solo funciona con repos públicos)
5. Haz clic en "Create repository"

### 2. Subir archivos al repositorio


#### Usando los scripts automatizados (RECOMENDADO)
1. Ejecuta `git-setup.bat` desde la carpeta del proyecto
2. El script configurará todo automáticamente
3. Conectará con: https://github.com/Sebasm2kuy/alunauy

#### Manualmente con Git
```bash
git clone https://github.com/Sebasm2kuy/alunauy.git
cd alunauy
# Copia todos tus archivos aquí
git add .
git commit -m "Initial commit - ALuna website"
git push origin main
```

### 3. Activar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" (pestaña superior)
3. Scroll down hasta "Pages" en el menú lateral
4. En "Source", selecciona "Deploy from a branch"
5. En "Branch", selecciona "main" y "/ (root)"
6. Haz clic en "Save"

### 4. ¡Tu sitio está listo!
- Tu sitio estará en: `https://sebasm2kuy.github.io/alunauy`
- Puede tardar unos minutos en estar disponible
- Cada vez que hagas cambios y los subas, se actualizará automáticamente

## ✅ Verificaciones incluidas
- [x] Archivo `.nojekyll` para evitar procesamiento Jekyll
- [x] Enlaces HTTPS para fuentes de Google
- [x] Meta tags SEO optimizados
- [x] Estructura compatible con GitHub Pages

## 🔧 Configuración del dominio personalizado
Si más adelante quieres usar un dominio personalizado:
1. Configura los DNS de tu dominio para apuntar a GitHub Pages:
   - Tipo A: 185.199.108.153
   - Tipo A: 185.199.109.153  
   - Tipo A: 185.199.110.153
   - Tipo A: 185.199.111.153
2. Edita el archivo `CNAME` con tu dominio
3. En GitHub Pages settings, agrega tu dominio personalizado

## 🔄 Flujo de trabajo diario

Para actualizar el sitio:
1. Haz cambios en `c:\alunauy-main`
2. Ejecuta `sync-github.bat`
3. Los cambios se subirán automáticamente
4. El sitio se actualizará en unos minutos

## 📞 Soporte
Si tienes problemas, revisa la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages)