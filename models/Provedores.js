// models/Proveedores.js
const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  idProd:  { type: Number, required: true, unique: true },
  nameProd: { type: String, required: true }


});

const Proveedor = mongoose.model('Proveedor', proveedorSchema);
module.exports = Proveedor;