module.exports = {
    // Middleware para redirigir usuarios logueados
    isAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return res.redirect("/dashboard");  // Redirige al dashboard si está logueado
      }
      return next();  // Si no está logueado, continúa con la ruta
    }
  };
  