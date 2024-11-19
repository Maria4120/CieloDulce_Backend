// models/Compra.js
const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  fecha: String
});

module.exports = mongoose.model('Compra', compraSchema);
