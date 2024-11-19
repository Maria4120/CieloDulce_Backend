document.addEventListener('DOMContentLoaded', function () {
    async function cargarMensajes() {
        const messagesContainer = document.getElementById('messages2');

        // Verificar si el contenedor existe
        if (!messagesContainer) {
            console.error("El contenedor 'messages' no se encontró en el DOM.");
            return;
        }

        messagesContainer.innerHTML = ''; 

        try {
            // Recuperar los mensajes de la API
            const response = await fetch('https://vibramusical.onrender.com/contact');

            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            const contactos = await response.json();

            // Comprobar si hay mensajes
            if (contactos.length === 0) {
                messagesContainer.innerHTML = '<p>No hay mensajes enviados.</p>';
                return;
            }

            // Mostrar los mensajes en el contenedor
            contactos.forEach(contacto => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message-card');

                messageDiv.innerHTML = `
                    <h3>${contacto.name}</h3>
                    <p><strong>Cédula:</strong> ${contacto.id}</p>
                    <p><strong>Correo:</strong> ${contacto.email}</p>
                    <p><strong>Mensaje:</strong> ${contacto.message}</p>
                    <button class="delete-button" data-id="${contacto._id}">Eliminar</button>
                    <hr>
                `;

                messagesContainer.appendChild(messageDiv);
            });

            // Manejar el evento de eliminación de mensajes
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    eliminarMensaje(id);
                });
            });
        } catch (error) {
            console.error('Error al cargar los mensajes:', error);
        }
    }

    // Llama a cargarMensajes al cargar la página
    cargarMensajes();

    // Manejador de envío del formulario
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault(); 

            const id = document.getElementById('id').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('https://vibramusical.onrender.com/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, name, email, message }),
                });

                if (response.ok) {
                    alert('Mensaje enviado con éxito.');
                    cargarMensajes(); 
                    contactForm.reset(); 
                } else {
                    alert('Error al enviar el mensaje. Inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
                alert('Error al enviar el mensaje. Inténtalo de nuevo.');
            }
        });
    }
});

// Función para eliminar un mensaje
async function eliminarMensaje(id) {
    try {
        const response = await fetch(`https://vibramusical.onrender.com/contact/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Mensaje eliminado con éxito.');
            location.reload(); 
        } else {
            alert('Error al eliminar el mensaje. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el mensaje. Inténtalo de nuevo.');
    }
}
