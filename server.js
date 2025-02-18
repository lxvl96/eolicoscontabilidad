require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Conectado"))
  .catch((err) => console.error(err));

// Configuración de EJS
app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Sesiones
app.use(
  session({
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Middleware global para mensajes flash
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
// Middleware global para hacer que "user" esté disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


// Rutas
app.use("/", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

