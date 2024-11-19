async function mostrarComprasRealizadas() {
    const usuarioActual = sessionStorage.getItem('loggedInUser');
    const comprasList = document.getElementById('compras-list2');

    try {
        const response = await fetch(`https://vibramusical.onrender.com/compras/${usuarioActual}`);

        if (!response.ok) {
            throw new Error('Error al obtener compras: ' + response.statusText);
        }

        const compras = await response.json();

        if (compras.length === 0) {
            comprasList.innerHTML = '<p>No se han realizado compras.</p>';
        } else {
            comprasList.innerHTML = '';
            compras.forEach(compra => {
                const compraDiv = document.createElement('div');
                compraDiv.classList.add('compra');

                let productosHtml = compra.productos.map(item => {
                    return `<p>${item.name} - Cantidad: ${item.quantity}</p>`;
                }).join('');

                compraDiv.innerHTML = `
                    <h3>Compra realizada el: ${new Date(compra.fecha).toLocaleString()}</h3>
                    <p>Usuario: ${compra.usuario.username}</p>
                    <p>Total: $${compra.total.toFixed(2)}</p>
                    <div>${productosHtml}</div>
                    <button class="btnEliminarCom" onclick="deleteCompra('${compra._id}')">Eliminar</button>             
                `;

                comprasList.appendChild(compraDiv);
            });
        }
    } catch (error) {
        console.error('Error al mostrar las compras:', error);
        comprasList.innerHTML = '<p>Hubo un error al cargar las compras.</p>';
    }
}

document.addEventListener('DOMContentLoaded', mostrarComprasRealizadas);

async function mostrarComprasRealizadas2() {
    const usuarioActual = sessionStorage.getItem('loggedInUser');

    if (usuarioActual && usuarioActual === 'admin') {
        const comprasList = document.getElementById('compras-list');

        try {
            const response = await fetch('https://vibramusical.onrender.com/compras');
    
            if (!response.ok) {
                throw new Error('Error al obtener compras: ' + response.statusText);
            }
    
            const compras = await response.json();
    
            if (compras.length === 0) {
                comprasList.innerHTML = '<p>No se han realizado compras.</p>';
            } else {
                comprasList.innerHTML = '';
                compras.forEach(compra => {
                    const compraDiv = document.createElement('div');
                    compraDiv.classList.add('compra');
    
                    let productosHtml = compra.productos.map(item => {
                        return `<p>${item.name} - Cantidad: ${item.quantity}</p>`;
                    }).join('');
    
                    compraDiv.innerHTML = `
                        <h3>Compra realizada el: ${new Date(compra.fecha).toLocaleString()}</h3>
                        <p>Usuario: ${compra.usuario.username}</p>
                        <p>Total: $${compra.total.toFixed(2)}</p>
                        <div>${productosHtml}</div>
                        <button class="btnEliminarCom2" onclick="deleteCompra('${compra._id}')">Eliminar</button>             
                    `;
    
                    comprasList.appendChild(compraDiv);
                });
            }
        } catch (error) {
            console.error('Error al mostrar las compras:', error);
            comprasList.innerHTML = '<p>Hubo un error al cargar las compras.</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', mostrarComprasRealizadas2);

// Función para eliminar una compras
async function deleteCompra(compraId) {
   // console.log('Intentando eliminar compra con ID:', compraId);
    try {
        const response = await fetch(`https://vibramusical.onrender.com/compras/${compraId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error('Error al eliminar la compra: ' + errorData.message);
        }

        //console.log('Compra eliminada correctamente en el backend');
        alert('Compra eliminada correctamente.');

        // Actualizar la lista de compras
        const usuarioActual = sessionStorage.getItem('loggedInUser');
        if (usuarioActual === 'admin') {
            mostrarComprasRealizadas2();
        } else {
            mostrarComprasRealizadas();
        }
    } catch (error) {
        console.error('Error al eliminar la compra:', error);
        alert('Error al eliminar la compra: ' + error.message); 
    }
}
