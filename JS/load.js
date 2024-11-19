// Función para cargar y mostrar los productos en la página principal desde MongoDB
async function loadProducts() {
    const productList = document.getElementById('product-list');

    try {
        // Solicita los productos desde el backend
        const response = await fetch('https://vibramusical.onrender.com/products');
        const products = await response.json();

        // Limpiar el contenedor de productos
        productList.innerHTML = '';

        // Crear las tarjetas de productos
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
            <h3>${product.category}</h3>
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Precio: ₡${product.price}</p>
            <p>Cantidad disponible: ${product.quantity}</p>
            ${product.quantity === 0 ? '<p class="sold-out">PRODUCTO AGOTADO</p>' : ''}
            <button class="add-to-cart-btn" ${product.quantity === 0 ? 'disabled' : ''} data-index="${index}">Agregar al carrito</button>`;

            productList.appendChild(productCard);
        });

        // Agregar eventos a los botones "Agregar al carrito"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function () {
                const productIndex = this.getAttribute('data-index');
                const selectedProduct = products[productIndex];
                agregarAlCarrito(selectedProduct);
            });
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}
document.addEventListener('DOMContentLoaded', loadProducts);
