const DepositoDGM = require("../models/DepositosDGM");
const CargaDGM = require("../models/CargasDGM");
const DepositoCMDM = require("../models/DepositosCMDM");
const CargaCMDM = require("../models/CargasCMDM");
const DepositoNEM = require("../models/DepositosNEM");
const CargaNEM = require("../models/CargasNEM");
const DepositoNSC = require("../models/DepositosNSC");
const CargaNSC = require("../models/CargasNSC");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Mostrar formulario de login
exports.getLogin = (req, res) => {
  res.render("login");
};

// Mostrar formulario de login de empresa
exports.getLoginEmpresa = (req, res) => {
  res.render("empresa");
};

// Procesar login
exports.postLogin = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/",
  failureFlash: true,
});

// Mostrar formulario de registro
exports.getRegister = (req, res) => {
  res.render("register");
};

// Procesar registro
exports.postRegister = async (req, res) => {
  const { name, email, password, password2 } = req.body;

  if (password !== password2) {
    req.flash("error_msg", "Las contraseñas no coinciden");
    return res.redirect("/register");
  }

  let user = await User.findOne({ email });
  if (user) {
    req.flash("error_msg", "El email ya está registrado");
    return res.redirect("/register");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ name, email, password: hashedPassword });
  await user.save();

  req.flash("success_msg", "Registro exitoso. Ahora puedes iniciar sesión.");
  res.redirect("/login");
};

// Logout
exports.logout = (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "Sesión cerrada");
    res.redirect("/");
  });
};

// Dashboard
/*  exports.getDashboard = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "No autorizado. Inicia sesión.");
    return res.redirect("/");
  }
  res.render("dashboard", { user: req.user });
};  */

/* // DashboardEmpresa
exports.getEmpresDashboard = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "No autorizado. Inicia sesión.");
    return res.redirect("/");
  }
  res.render("empresa", { user: req.user });
}; */

// Dashboard
exports.getDashboard = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error_msg", "No autorizado. Inicia sesión.");
    return res.redirect("/");
  }
  const depositos = await DepositoDGM.find().sort({ fechaDeposito: -1 });
  //const cargas = await Carga.find().populate("depositoSeleccionado").sort({ fechaCarga: -1 });

  try {
    // Obtener el último depósito registrado
    const ultimoDeposito = await DepositoDGM.findOne().sort({ fechaDeposito: -1 });
    // Obtener la suma total de todos los depósitos
    const totalDepositos = await DepositoDGM.aggregate([
      { $group: { _id: null, total: { $sum: "$cantidadDeposito" } } }
    ]);
     // Obtener el total consumido (suma de todos los importes de cargas)
     const totalConsumido = await CargaDGM.aggregate([
      { $group: { _id: null, total: { $sum: "$importeCarga" } } }
  ]);

    if (!ultimoDeposito) {
      return res.render("dashboard", { user: req.user,depositos, mensaje: null, totalImporte: 0, saldoRestante: 0, cargas: [], mensaje: "No hay depósitos registrados aún.",totalConsumido: totalConsumido.length > 0 ? totalConsumido[0].total : 0, totalDepositos: totalDepositos.length > 0 ? totalDepositos[0].total : 0 });
    }

    // Buscar cargas asociadas al último depósito
    const cargas = await CargaDGM.find({ depositoSeleccionado: ultimoDeposito._id })
      .populate("depositoSeleccionado")
      .sort({ fechaCarga: -1 });

    // Calcular la suma total de los importes
    const totalImporte = CargaDGM.reduce((sum, carga) => sum + carga.importeCarga, 0);
    // Calcular el saldo restante
    const saldoRestante = ultimoDeposito.cantidadDeposito - totalImporte;
    res.render("dashboard", { user: req.user, depositos, cargas, mensaje: null, totalImporte, saldoRestante , totalDepositos: totalDepositos.length > 0 ? totalDepositos[0].total : 0,totalConsumido: totalConsumido.length > 0 ? totalConsumido[0].total : 0});
    //res.render("lista-cargas", { cargas, mensaje: null });
  } catch (error) {
    res.status(500).send("Error al obtener las cargas");
  }

};