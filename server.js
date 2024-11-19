const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Contact = require('./models/Contact');
const Compra = require('./models/Compras');

const app = express();

// Configuración de CORS para permitir peticiones desde cualquier origen
app.use(cors());
app.use((err, req, res, next) => {
   console.error(err);
   res.status(err.status || 500).send(err.message || 'Error del servidor');
});

// Aumenta el límite de tamaño de la carga
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Para formularios

app.use(express.json());

// URI de conexión a MongoDB
const mongoURI = '';

mongoose.connect(mongoURI)
   .then(() => console.log('Conectado exitosamente a MongoDB'))
   .catch(error => console.error('Error al conectar a MongoDB:', error));

mongoose.connection.on('connected', () => {
   console.log('Mongoose está conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
   console.log('Error de conexión con MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
   console.log('Mongoose se ha desconectado de MongoDB');
});

process.on('SIGINT', async () => {
   await mongoose.connection.close();
   console.log('Mongoose desconectado debido al cierre de la aplicación');
   process.exit(0);
});

// Ruta de registro de usuario
app.post('/register', async (req, res) => {
   const { id, email, username, password } = req.body;

   if (!id || !email || !username || !password) {
      return res.status(400).json({ message: 'Datos de usuario son requeridos.' });
   }

   try {
      // Verificación de usuario en MongoDB usando el modelo de Mongoose
      const userExists = await User.findOne({ id });
      if (userExists) {
         return res.status(400).json({ message: 'La cédula de usuario ya está en uso' });
      }

      // Hash de contraseña y registro de usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ id, email, username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
   } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
   }
});

// Obtener todos los usuarios
app.get('/users', async (req, res) => {
   try {
      const users = await User.find();
      res.json(users);
   } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios' });
   }
});

// Editar usuario (cargarlo en el formulario)
app.get('/users/:id', async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send('Usuario no encontrado');
      res.json(user);
   } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario' });
   }
});

// Crear un nuevo usuario
app.post('/users', async (req, res) => {
   const { id, email, username, password } = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = new User({ id, email, username, password: hashedPassword });

   try {
      await newUser.save();
      res.status(201).json(newUser);
   } catch (error) {
      res.status(400).json({ message: 'Error al crear el usuario' });
   }
});

// Editar un usuario
app.put('/users/:id', async (req, res) => {
   try {
      const { id, email, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); 

      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
         id, email, username,
         password: hashedPassword,
      }, { new: true });

      if (!updatedUser) return res.status(404).send('Usuario no encontrado');
      res.json(updatedUser);
   } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el usuario' });
   }
});

// Eliminar un usuario
app.delete('/users/:id', async (req, res) => {
   try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).send('Usuario no encontrado');
      res.json(deletedUser);
   } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el usuario' });
   }
});

app.post('/login', async (req, res) => {
   const { id, password } = req.body;

   if (!id || !password) {
      return res.status(400).json({ message: 'Cédula y contraseña son requeridos.' });
   }

   try {
      // Buscar usuario en la base de datos
      const user = await User.findOne({ id });
      if (!user) {
         return res.status(400).json({ message: 'Cédula o contraseña incorrectos' });
      }

      // Comparar contraseña ingresada con la almacenada en la base de datos
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return res.status(400).json({ message: 'Cédula o contraseña incorrectos' });
      }

      // Verificar si el usuario tiene privilegios de administrador
      if (user.username === 'admin') {
         return res.status(200).json({ message: 'Bienvenido, administrador', admin: true });
      }

      // Inicio de sesión exitoso para usuario normal
      res.status(200).json({ message: `Bienvenido, ${user.username}`, admin: false, username: user.username });
   } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
   }
});

// Ruta para agregar un nuevo producto
app.post('/products', async (req, res) => {
   try {
      const { category, name, price, description, quantity, image } = req.body;
      const newProduct = new Product({ category, name, price, description, quantity, image });
      await newProduct.save();
      res.status(201).json(newProduct);
   } catch (error) {
      res.status(500).json({ message: 'Error al agregar el producto', error });
   }
});


// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
   try {
      const products = await Product.find();
      res.json(products);
   } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos', error });
   }
});

// Ruta para obtener un producto específico
app.get('/products/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
         return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
   } catch (error) {
      res.status(500).json({ message: 'Error al obtener el producto', error });
   }
});

// Ruta para actualizar un producto específico
app.put('/products/:id', async (req, res) => {
   const { id } = req.params;
   const { quantity } = req.body;

   try {
      // Validación de la cantidad
      if (typeof quantity !== 'number' || quantity <= 0) {
         return res.status(400).json({ message: 'La cantidad debe ser un número positivo' });
      }

      // Buscar el producto
      const product = await Product.findById(id);
      if (!product) {
         return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Actualizar la cantidad
      product.quantity += quantity;
      await product.save();

      res.json({ message: 'Cantidad actualizada con éxito', product });
   } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el producto', error });
   }
});


// Ruta para eliminar un producto
app.delete('/products/:id', async (req, res) => {
   try {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.json({ message: 'Producto eliminado correctamente' });
   } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el producto', error });
   }
});

// Ruta para actualizar el stock de un producto específico
app.patch('/products/:name', async (req, res) => {
   try {
      const { quantity } = req.body;
      const updatedProduct = await Product.findOneAndUpdate(
         { name: req.params.name },
         { $inc: { quantity } }, 
         { new: true }
      );

      if (!updatedProduct) {
         return res.status(404).json({ message: 'Producto no encontrado.' });
      }

      res.status(200).json({ message: 'Stock actualizado correctamente.' });
   } catch (error) {
      console.error('Error al actualizar el stock:', error);
      res.status(500).json({ message: 'Error interno al actualizar el stock.' });
   }
});


// Endpoint para enviar un mensaje de contacto
app.post('/contact', async (req, res) => {
   const { id, name, email, message } = req.body;

   const contacto = new Contact({ id, name, email, message });
   await contacto.save();

   res.status(201).send({ message: 'Mensaje enviado con éxito.' });
});

// Endpoint para obtener los mensajes de contacto
app.get('/contact', async (req, res) => {
   const contactos = await Contact.find();
   res.status(200).json(contactos);
});

// Endpoint para eliminar un mensaje por ID
app.delete('/contact/:id', async (req, res) => {
   const { id } = req.params;

   await Contact.findByIdAndDelete(id);
   res.status(200).send({ message: 'Mensaje eliminado con éxito.' });
});

app.post('/compras', async (req, res) => {
   const { usuario, productos, total, fecha } = req.body;

   try {
      const user = await User.findOne({ username: usuario });
      if (!user) {
         return res.status(400).json({ message: 'Usuario no encontrado.' });
      }

      // Crear una nueva compra
      const nuevaCompra = new Compra({
         usuario: user._id,
         productos,
         total,
         fecha
      });

      // Guardar la compra en la base de datos
      await nuevaCompra.save();

      res.status(201).json({ message: 'Compra guardada exitosamente.' });
   } catch (error) {
      console.error('Error al guardar la compra:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
   }
});

// Ruta para obtener todas las compras
app.get('/compras', async (req, res) => {
   try {
      const compras = await Compra.find().populate('usuario', 'username');
      res.status(200).json(compras);
   } catch (error) {
      console.error('Error al obtener todas las compras:', error);
      res.status(500).json({ message: 'Error al obtener las compras' });
   }
});

// Ruta para obtener compras de un usuario específico
app.get('/compras/:usuario', async (req, res) => {
   try {
      const user = await User.findOne({ username: req.params.usuario });
      if (!user) {
         return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      // Populate para incluir la información del usuario
      const compras = await Compra.find({ usuario: user._id }).populate('usuario', 'username');
      res.status(200).json(compras);
   } catch (error) {
      console.error('Error al obtener las compras:', error);
      res.status(500).json({ message: 'Error al obtener las compras' });
   }
});

app.delete('/compras/:id', async (req, res) => {
   try {
      const { id } = req.params;

      // Buscar la compra antes de eliminarla
      const compra = await Compra.findById(id);
      if (!compra) {
         console.error('Compra no encontrada');
         return res.status(404).json({ message: 'Compra no encontrada' });
      }

      // Reintegrar stock para cada producto en la compra
      const actualizacionPromesas = compra.productos.map(async item => {
         //console.log(`Reintegrando stock para el producto ID: ${item.productoId}, Cantidad: ${item.quantity}`);
         
         // Buscar el producto correspondiente
         const producto = await Product.findById(item.productoId);
         if (!producto) {
            console.error(`Producto no encontrado para ID: ${item.productoId}`);
            return; 
         }

         // Actualiza el stock
         try {
            await Product.findByIdAndUpdate(item.productoId, {
               $inc: { quantity: item.quantity } 
            });
           // console.log(`Stock actualizado para el producto ${item.productoId}: +${item.quantity}`);
         } catch (updateError) {
           // console.error(`Error al actualizar stock para producto ${item.productoId}:`, updateError);
         }
      });

      // Esperar que todas las actualizaciones se completen
      await Promise.all(actualizacionPromesas);

      // Eliminar la compra después de ajustar el stock
      await Compra.findByIdAndDelete(id);
      console.log(`Compra ${id} eliminada correctamente`);

      res.status(200).json({ message: 'Compra eliminada y productos reintegrados al stock' });
   } catch (error) {
      console.error('Error al eliminar la compra:', error);
      res.status(500).json({ message: 'Error al eliminar la compra' });
   }
});

const PORT = 3000;
app.listen(PORT, () => {
   console.log(`Servidor ejecutando en el puerto ${PORT}`);
});
