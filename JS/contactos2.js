document.addEventListener('DOMContentLoaded', function () {
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
