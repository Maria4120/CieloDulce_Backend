
let carrito = [];
let subtotal = 0;
let total = 0;
let iva = 0;

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.name === producto.name);

    if (productoExistente) {
        if (productoExistente.quantity < producto.quantity) {
            productoExistente.quantity++;
        } else {
            alert('No hay más stock disponible para este producto');
        }
    } else {
        carrito.push({ ...producto, quantity: 1 });
    }

    subtotal += parseFloat(producto.price);
    iva = subtotal * 0.13;
    total = subtotal + iva;
    actualizarCarrito();
}

// Actualizar la visualización del carrito
function actualizarCarrito() {
    const cartBtn = document.getElementById('cart-btn');
    const cartItems = document.getElementById('cart-items');
    const cartSubTotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');

    cartBtn.innerText = `Carrito (${carrito.length})`;
    cartItems.innerHTML = '';

    carrito.forEach(item => {
        let li = document.createElement('li');
        li.innerText = `${item.name} - ₡${item.price} - Cantidad: ${item.quantity}`;
        cartItems.appendChild(li);
    });

    cartSubTotal.innerText = subtotal.toFixed(2);
    cartTax.innerText = iva.toFixed(2);
    cartTotal.innerText = total.toFixed(2);
}

// Mostrar/Ocultar carrito
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cart-btn'); 
    const overlay = document.getElementById('overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart'); 

    // Agregar evento para el botón del carrito
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // Ocultar carrito al hacer clic en el overlay
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active'); 
    });

    // Ocultar carrito al hacer clic en el botón de cierre
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

});

async function finalizarCompra() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('Debes iniciar sesión para realizar una compra.');
        return;
    }

    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    let response = await fetch('https://vibramusical.onrender.com/products');
    let productos = await response.json();

    let compraValida = true;
    let nuevaCompra = {
        usuario: loggedInUser,
        productos: [],
        total: total.toFixed(2),
        fecha: new Date().toLocaleString()
    };

    // Dentro de la lógica de finalizarCompra
    carrito.forEach(item => {
        let producto = productos.find(p => p.name === item.name);
        if (producto) {
            if (producto.quantity >= item.quantity) {
                producto.quantity -= item.quantity;
    
                // Agregar el `productoId` a cada producto en la compra
                nuevaCompra.productos.push({
                    productoId: producto._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                });
            } else {
                compraValida = false;
                alert(`No hay suficiente stock para ${item.name}`);
            }
        }
    });
    
    if (compraValida) {
        // Enviar la compra al servidor
        try {
            const compraResponse = await fetch('https://vibramusical.onrender.com/compras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaCompra),
            });

            if (compraResponse.ok) {
                // Actualizar stock después de guardar la compra
                const actualizacionPromesas = nuevaCompra.productos.map(item => {
                    //console.log(`Actualizando stock de ${item.name} por ${-item.quantity}`);
                    return fetch(`https://vibramusical.onrender.com/products/${item.name}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ quantity: -item.quantity }) 
                    });
                });

                // Esperar que todas las actualizaciones se completen
                await Promise.all(actualizacionPromesas);
                alert('Compra realizada con éxito.');
                carrito = []; 
                subtotal = 0;
                iva = 0;
                total = 0;
                actualizarCarrito(); 
                loadProducts(); 
            } else {
                alert('Error al realizar la compra. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al enviar la compra:', error);
            alert('Hubo un error al intentar realizar la compra.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            const loggedInUser = sessionStorage.getItem('loggedInUser'); 
            if (!loggedInUser) {
                alert('Debes iniciar sesión para realizar una compra.');
                window.location.href = '/HTML/login.html';
                return;
            }
            finalizarCompra();
        });
    } else {
        console.error('El elemento checkout-btn no existe en el DOM');
    }

   // loadProducts();
});

function verificarRolUsuario() {
    let usuarioActual = localStorage.getItem('loggedInUser');

    if (usuarioActual === 'admin') {
        document.getElementById('admin-options').style.display = 'block';
    } else {
        document.getElementById('admin-options').style.display = 'none';
    }
}
