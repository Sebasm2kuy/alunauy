# 🚀 Instrucciones de Despliegue - GitHub Pages

## Pasos para publicar tu sitio ALuna en GitHub Pages

### 1. Crear repositorio en GitHub
1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en "New repository" (botón verde)
3. Nombra tu repositorio (ej: `aluna-cosmeticos`)
4. Marca como **público** (GitHub Pages gratis solo funciona con repos públicos)
5. Haz clic en "Create repository"

### 2. Subir archivos al repositorio
Tienes varias opciones:

#### Opción A: Usando GitHub Web (más fácil)
1. En tu nuevo repositorio, haz clic en "uploading an existing file"
2. Arrastra todos los archivos de tu proyecto
3. Escribe un mensaje de commit: "Initial commit - ALuna website"
4. Haz clic en "Commit changes"

#### Opción B: Usando Git (línea de comandos)
```bash
git clone https://github.com/TU-USUARIO/aluna-cosmeticos.git
cd aluna-cosmeticos
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
- GitHub te dará una URL como: `https://tu-usuario.github.io/aluna-cosmeticos`
- Puede tardar unos minutos en estar disponible
- Cada vez que hagas cambios y los subas, se actualizará automáticamente

## ✅ Verificaciones incluidas
- [x] Archivo `.nojekyll` para evitar procesamiento Jekyll
- [x] Enlaces HTTPS para fuentes de Google
- [x] Meta tags SEO optimizados
- [x] Estructura compatible con GitHub Pages

## 🔧 Configuración del dominio personalizado (cuando esté listo)
Si más adelante quieres usar tu dominio `alunauy.es`:
1. Configura los DNS de tu dominio para apuntar a GitHub Pages:
   - Tipo A: 185.199.108.153
   - Tipo A: 185.199.109.153  
   - Tipo A: 185.199.110.153
   - Tipo A: 185.199.111.153
2. Edita el archivo `CNAME` con tu dominio: `alunauy.es`
3. En GitHub Pages settings, agrega tu dominio personalizado

## 📞 Soporte
Si tienes problemas, revisa la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages)