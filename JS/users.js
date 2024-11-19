let editingIndex = -1; 

// Cargar usuarios desde MongoDB y mostrarlos en la página
async function loadUsers() {
  try {
    const response = await fetch('https://vibramusical.onrender.com/users');
    const users = await response.json();
    const userList = document.getElementById('user-list');

    if (!userList) {
      return;
    }

    userList.innerHTML = '';

    users.forEach((user, index) => {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
        <h3>${user.username}</h3>
        <p>Cédula: ${user.id}</p>
        <p>Correo: ${user.email}</p>
        <p>Password: ${user.password}</p>
        <div class="user-card-buttons">
          <button class="edit-btn" data-id="${user._id}">Editar</button>
          <button class="delete-btn" data-id="${user._id}">Eliminar</button>
          
        </div>
      `;
      userList.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

// Guardar o modificar un usuario
async function saveUser(event) {
  event.preventDefault();
  const id = document.getElementById('id').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (editingIndex !== -1) {
    // Modificar usuario existente
    try {
      const response = await fetch(`https://vibramusical.onrender.com/users/${editingIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email, username, password }),
      });

      if (!response.ok) throw new Error('Error al modificar el usuario');
      alert('Usuario modificado exitosamente');
    } catch (error) {
      alert(error.message);
    }
    editingIndex = -1; // Resetear índice de edición
  } else {
    // Crear nuevo usuario
    try {
      const response = await fetch('https://vibramusical.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email, username, password }),
      });

      if (!response.ok) throw new Error('Error al crear el usuario');
      alert('Usuario creado exitosamente');
    } catch (error) {
      alert(error.message);
    }
  }

  document.getElementById('user-form').reset();
  loadUsers();
}

// Eliminar un usuario
async function deleteUser(id) {
  try {
    const response = await fetch(`https://vibramusical.onrender.com/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar el usuario');
    loadUsers();
  } catch (error) {
    alert(error.message);
  }
}

// Editar usuario (cargarlo en el formulario)
async function editUser(id) {
  try {
    const response = await fetch(`https://vibramusical.onrender.com/users/${id}`);
    const user = await response.json();
    document.getElementById('id').value = user.id;
    document.getElementById('email').value = user.email;
    document.getElementById('username').value = user.username;
    document.getElementById('password').value = user.password;
    editingIndex = id; 
  } catch (error) {
    alert('Error al cargar el usuario para editar');
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
  loadUsers();

  const userForm = document.getElementById('user-form');
  const userList = document.getElementById('user-list');

  if (userForm) {
    userForm.addEventListener('submit', saveUser);
  }

  if (userList) {
    userList.addEventListener('click', function (event) {
      if (event.target.classList.contains('edit-btn')) {
        const id = event.target.getAttribute('data-id');
        editUser(id);
      }

      if (event.target.classList.contains('delete-btn')) {
        const id = event.target.getAttribute('data-id');
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
          deleteUser(id);
        }
      }
    });
  }
});
