// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   category: { type: String, required: true },
   name: { type: String, required: true },
   price: { type: Number, required: true },
   description: { type: String, required: true },
   quantity: { type: Number, required: true },
   image: { type: String, required: true } // Almacena la imagen como un string (base64)
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
