<nav class="bg-white shadow-md fixed w-full z-10">
  <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
    <div class="flex items-center space-x-2 cursor-pointer">
      <img src="/logo.png" alt="Aluna UY" class="h-8 w-8" />
      <span class="text-lg font-semibold text-gray-800">Aluna UY</span>
    </div>

    <div class="hidden md:flex space-x-6 items-center">
      <a href="#hero" class="text-gray-600 hover:text-blue-600">Inicio</a>
      <div class="relative group">
        <button class="text-gray-600 hover:text-blue-600">Productos</button>
        <div class="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <a href="#producto1" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Producto 1</a>
          <a href="#producto2" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Producto 2</a>
          <a href="#producto3" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Producto 3</a>
        </div>
      </div>
      <a href="#about" class="text-gray-600 hover:text-blue-600">Sobre Nosotros</a>
      <a href="#contact" class="text-gray-600 hover:text-blue-600">Contacto</a>
    </div>

    <div class="md:hidden">
      <button id="mobile-menu-button" class="text-gray-600 hover:text-blue-600 focus:outline-none">
        ☰
      </button>
    </div>
  </div>

  <!-- Menú móvil -->
  <div id="mobile-menu" class="hidden md:hidden bg-white px-4 pb-4 space-y-2">
    <a href="#hero" class="block text-gray-600 hover:text-blue-600">Inicio</a>
    <div class="border-t border-gray-200 pt-2">
      <span class="block text-gray-600 font-semibold">Productos</span>
      <a href="#producto1" class="block text-gray-600 hover:text-blue-600 ml-4">Producto 1</a>
      <a href="#producto2" class="block text-gray-600 hover:text-blue-600 ml-4">Producto 2</a>
      <a href="#producto3" class="block text-gray-600 hover:text-blue-600 ml-4">Producto 3</a>
    </div>
    <a href="#about" class="block text-gray-600 hover:text-blue-600">Sobre Nosotros</a>
    <a href="#contact" class="block text-gray-600 hover:text-blue-600">Contacto</a>
  </div>
</nav>

<script>
  const menuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
</script>
