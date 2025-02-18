const mongoose = require("mongoose");

const cargaSchema = new mongoose.Schema({
    fechaCarga: { type: Date, required: true },
    importeCarga: { type: Number, required: true },
    tipoCombustible: { type: String, required: true },
    depositoSeleccionado: { type: mongoose.Schema.Types.ObjectId, ref: "DepositosNereidaSC", required: true },
  });
  module.exports = mongoose.model("CargasNereidaSC", cargaSchema);