async function loginUser(event) {
  event.preventDefault();

  const id = document.getElementById('login-id').value;
  const password = document.getElementById('login-password').value;

  if (!id || !password) {
    displayError('Por favor, ingrese la cédula y contraseña válidos');
    return;
  }

  try {
    const response = await fetch('https://vibramusical.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      if (result.admin) {
        sessionStorage.setItem('loggedInUser', 'admin');
        window.location.href = '/HTML/admin.html';
      } else {
        sessionStorage.setItem('loggedInUser', result.username);
        window.location.href = '/index.html';
      }
    } else {
      displayError(result.message);
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    displayError('Hubo un error al intentar iniciar sesión');
  }
}

function displayError(message) {
  const errorSpan = document.createElement('span');
  errorSpan.textContent = message;
  errorSpan.style.color = 'red';
  document.querySelector('main').appendChild(errorSpan);
}

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  }
});
