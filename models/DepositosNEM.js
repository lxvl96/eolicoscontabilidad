const mongoose = require("mongoose");
// Definir el esquema de depósito
const depositoSchema = new mongoose.Schema({
    fechaDeposito: { type: Date, required: true },
    cantidadDeposito: { type: Number, required: true },
  });

  module.exports = mongoose.model("DepositosNextEM", depositoSchema);