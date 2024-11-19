// Registro de usuarios
async function registerUser(event) {
  event.preventDefault();
  const id = document.getElementById('register-id').value;
  const email = document.getElementById('register-email').value;
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  if (!id || !email || !username || !password) {
    displayError('Por favor, ingrese un usuario y contraseña válidos');
    return;
  }

  try {
    const response = await fetch('https://vibramusical.onrender.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, email, username, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      document.getElementById('register-form').reset();
      window.location.href = '/HTML/login.html';
    } else {
      displayError(result.message);
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    displayError('Hubo un error al intentar registrar al usuario');
  }
}

function displayError(message) {
  const errorSpan = document.createElement('span');
  errorSpan.textContent = message;
  errorSpan.style.color = 'red';
  document.querySelector('main').appendChild(errorSpan);
}

document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', registerUser);
  }
});