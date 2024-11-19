// Función para agregar productos
async function addProduct(event) {
  event.preventDefault();

  const category = document.getElementById('product-category').value;
  const name = document.getElementById('product-name').value;
  const price = document.getElementById('product-price').value;
  const description = document.getElementById('product-description').value;
  const quantity = document.getElementById('product-quantity').value;
  const imageFile = document.getElementById('product-image').files[0];

  // Verificar que se haya ingresado todo
  if (!category || !name || !price || !description || !quantity || !imageFile) {
    alert('Por favor, ingrese todos los campos');
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const imageDataUrl = event.target.result;

    try {
      // Guardar el producto en MongoDB mediante una solicitud POST
      await fetch('https://vibramusical.onrender.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          name,
          price,
          description,
          quantity,
          image: imageDataUrl,
        }),
      });

      alert('Producto agregado exitosamente');
      document.getElementById('add-product-form').reset();
      displayProducts(); 
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Error al agregar el producto');
    }
  };
  reader.readAsDataURL(imageFile);
}

function resetForm() {
  const form = document.getElementById('add-product-form');
  form.reset();
  form.querySelector('button[type="submit"]').textContent = 'Agregar Producto';

  editingProductId = null;  
  form.onsubmit = handleSubmitForm;
}

// Agregar el evento al formulario de productos
document.addEventListener('DOMContentLoaded', function () {
  const addProductForm = document.getElementById('add-product-form');
  if (addProductForm) {
    addProductForm.addEventListener('submit', addProduct);
  }
  displayProducts();
});

// Función para mostrar los productos en la página
async function displayProducts() {
  const categoriesContainer = document.getElementById('categories-container');
  categoriesContainer.innerHTML = '';

  try {
    // Recuperar todos los productos de MongoDB mediante una solicitud GET
    const response = await fetch('https://vibramusical.onrender.com/products');
    const products = await response.json();

    if (products.length === 0) {
      categoriesContainer.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    // Agrupar productos por categoría
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    // Crear tarjetas por categoría
    for (const category in categories) {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category-section');

      const categoryTitle = document.createElement('h2');
      categoryTitle.innerText = category;
      categoryDiv.appendChild(categoryTitle);

      const productList = document.createElement('div');
      productList.classList.add('product-grid');

      categories[category].forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-item');
        productCard.innerHTML = `
          <h3>${product.name}</h3>
          <p>Precio: ₡${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
          <img src="${product.image}" alt="${product.name}">
          <button onclick="editProduct('${product._id}')" class="edit-btn">Editar</button>
          <button onclick="deleteProduct('${product._id}')" class="delete-btn">Eliminar</button>
        `;
        productList.appendChild(productCard);
      });

      categoryDiv.appendChild(productList);
      categoriesContainer.appendChild(categoryDiv);
    }
  } catch (error) {
    console.error('Error al mostrar productos:', error);
    alert('Error al cargar los productos');
  }
}

// Función para eliminar un producto
async function deleteProduct(productId) {
  try {
    await fetch(`https://vibramusical.onrender.com/${productId}`, {
      method: 'DELETE',
    });
    displayProducts();
    alert('Producto eliminado correctamente.');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    alert('Error al eliminar el producto');
  }
}

// Función para editar un producto
async function editProduct(productId) {
  try {
    const response = await fetch(`https://vibramusical.onrender.com/products/${productId}`);
    if (!response.ok) throw new Error("Producto no encontrado");

    const product = await response.json();

    // Cargar la información del producto en el formulario
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-quantity').value = product.quantity;

    // Cambiar el comportamiento del botón de agregar a actualizar
    const form = document.getElementById('add-product-form');
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Actualizar Producto';

    // Quitar el evento anterior
    form.removeEventListener('submit', addProduct);

    // Añadir un nuevo evento para actualizar el producto
    form.addEventListener('submit', async function updateProduct(event) {
      event.preventDefault();

      const updatedProduct = {
        category: document.getElementById('product-category').value,
        name: document.getElementById('product-name').value,
        price: document.getElementById('product-price').value,
        description: document.getElementById('product-description').value,
        quantity: document.getElementById('product-quantity').value,
      };

      // Verificar si se seleccionó una nueva imagen
      const imageInput = document.getElementById('product-image');
      if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = async function (e) {
          updatedProduct.image = e.target.result; 

          // Enviar la actualización al servidor después de que la imagen se haya leído
          try {
            const updateResponse = await fetch(`https://vibramusical.onrender.com/products/${productId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedProduct),
            });

            if (!updateResponse.ok) {
              throw new Error('Error al actualizar el producto');
            }

            alert('Producto actualizado correctamente.');
            submitButton.textContent = 'Agregar Producto';

            // Limpiar el formulario
            form.reset();

            // Restaurar el comportamiento original del formulario
            form.removeEventListener('submit', updateProduct);
            form.addEventListener('submit', addProduct);

            // Actualizar la lista de productos en pantalla
            displayProducts();
          } catch (error) {
            alert(error.message);
          }
        };

        reader.readAsDataURL(imageInput.files[0]);
      } else {
        // Si no se selecciona nueva imagen, utiliza la imagen existente
        updatedProduct.image = product.image; // Mantener la imagen previa

        // Enviar la actualización al servidor si no hay nueva imagen
        try {
          const updateResponse = await fetch(`https://vibramusical.onrender.com/products/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
          });

          if (!updateResponse.ok) {
            throw new Error('Error al actualizar el producto');
          }

          alert('Producto actualizado correctamente.');
          submitButton.textContent = 'Agregar Producto';

          // Limpiar el formulario
          form.reset();

          // Restaurar el comportamiento original del formulario
          form.removeEventListener('submit', updateProduct);
          form.addEventListener('submit', addProduct);

          // Actualizar la lista de productos en pantalla
          displayProducts();
        } catch (error) {
          alert(error.message);
        }
      }
    });
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    alert('Hubo un problema al cargar el producto.');
  }
}
