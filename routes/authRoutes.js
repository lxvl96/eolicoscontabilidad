const express = require("express");
const {isAuthenticated} = require("../middleware/authMiddleware");
const router = express.Router();
const authController = require("../controllers/authController");
const DepositosDGM = require("../models/DepositosDGM"); 
const CargaDGM = require("../models/CargasDGM");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, authController.getLogin);
router.get("/consulta", authController.getLoginEmpresa);
router.post("/login", authController.postLogin);

router.get("/register",  isAuthenticated,authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/dashboard",  authController.getPanel);

router.get("/logout", authController.logout);

/* router.post("/guardar-deposito-dgm", async (req, res) => {
    try {
      const nuevoDeposito = new DepositosDGM({
        fechaDeposito: req.body.fechaDeposito,
        cantidadDeposito: req.body.cantidadDeposito
      });
  
      await nuevoDeposito.save();
      res.redirect("/dashboard");
    } catch (error) {
      res.status(500).send("Error al guardar el depósito");
    }
  });

router.post("/guardar-carga-dgm", async (req, res) => {
    try {
      const nuevaCarga = new CargaDGM({
        fechaCarga: req.body.fechaCarga,
        importeCarga: req.body.importeCarga,
        tipoCombustible: req.body.tipoCombustible,
        depositoSeleccionado: req.body.depositoSeleccionado, // Se guarda el ID del depósito
      });
  
      await nuevaCarga.save();
      res.redirect("/dashboard");
    } catch (error) {
      res.status(500).send("Error al guardar la carga");
    }
  });

router.post("/eliminar-deposito-dgm/:id", async (req, res) => {
    try {
      const depositoId = req.params.id;
      
      // Eliminar el depósito de la base de datos
      await DepositosDGM.findByIdAndDelete(depositoId);
  
      // Redirigir a la lista de depósitos
      res.redirect("/dashboard");
    } catch (error) {
      res.status(500).send("Error al eliminar el depósito");
    }
  });

router.get("/eliminar-carga-dgm/:id", async (req, res) => {
    try {
      const cargaId = req.params.id;
  
      // Eliminar la carga de la base de datos
      await CargaDGM.findByIdAndDelete(cargaId);
  
      // Redirigir a la lista de cargas
      res.redirect("/dashboard");
    } catch (error) {
      res.status(500).send("Error al eliminar la carga");
    }
  }); */

router.get('/cargas/:clienteId', authController.getCargas);
router.get('/depositos/:clienteId', authController.getDepositos);
router.get('/cargas-deposito/:depositoId',authController.getCargasDepositos);
router.post('/nuevo-cliente', authController.postCliente);
router.post('/nuevo-deposito', authController.postDeposito);
router.post('/nueva-carga', authController.postCarga);
module.exports = router;

