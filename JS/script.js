function updateNav() {
  const loggedInUser = sessionStorage.getItem('loggedInUser');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');
  const historialLink = document.getElementById('historial-link');
  const adminLink = document.getElementById('productos-link');
  const welcomeMessage = document.getElementById('welcome-message');

  if (loggedInUser) {
    // Si hay un usuario logueado
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (historialLink) historialLink.style.display = 'inline';
    if (welcomeMessage) {
      welcomeMessage.style.display = 'inline';
      welcomeMessage.textContent = `Bienvenido, ${loggedInUser}`;
    }
    if (loggedInUser === 'admin' && adminLink) {
      adminLink.style.display = 'inline';
    }
    if (logoutLink) logoutLink.style.display = 'inline';
  } else {
    // Si no hay usuario logueado
    if (loginLink) loginLink.style.display = 'inline';
    if (registerLink) registerLink.style.display = 'inline';
    if (welcomeMessage) welcomeMessage.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// Función para cerrar sesión
function logoutUser() {
  sessionStorage.removeItem('loggedInUser');
  alert('Has cerrado sesión exitosamente.');
  updateNav();
  window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', function () {
  updateNav();

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', logoutUser);
  }

  // Agregar el evento del botón del menú hamburguesa
  const hamburgerBtn = document.getElementById('hamburger-btn');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        navbar.classList.toggle('active');
      }
    });
  }
});

// Cargar y actualizar los productos cuando se cargue la página principal
document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.includes('index.html')) {
    loadProducts();
  }
});

//Paleta de colores - temas
document.addEventListener('DOMContentLoaded', function () {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themes = ['theme-normal', 'theme-dark', 'theme-palette1', 'theme-palette2', 'theme-palette3', 'theme-palette4', 'theme-paletteHallo2', 'theme-paletteChristmas', 'theme-paletteIndependencia'];
  let currentThemeIndex = parseInt(sessionStorage.getItem('themeIndex')) || 0;

  // Aplicar el tema guardado en sessionStorage
  document.body.classList.add(themes[currentThemeIndex]);
  themeToggleBtn.textContent = `Cambiar a ${themes[(currentThemeIndex + 1) % themes.length].replace('theme-', '')}`;

  themeToggleBtn.addEventListener('click', function () {
    document.body.classList.remove(themes[currentThemeIndex]);

    // Alternar al siguiente tema
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);
    themeToggleBtn.textContent = `Cambiar a ${themes[(currentThemeIndex + 1) % themes.length].replace('theme-', '')}`;

    // Guardar el índice del tema actual
    sessionStorage.setItem('themeIndex', currentThemeIndex);
  });
});
