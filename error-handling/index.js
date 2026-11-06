// Traduce cada tipo de error a un código HTTP y un mensaje claros para el cliente
const getErrorResponse = (err) => {
  // express-jwt: token ausente, inválido o caducado
  if (err.name === "UnauthorizedError") {
    if (err.code === "credentials_required") {
      return { status: 401, message: "Authentication required" };
    }
    if (err.inner?.name === "TokenExpiredError") {
      return { status: 401, message: "Session expired. Please log in again" };
    }
    return { status: 401, message: "Invalid token" };
  }

  // express.json(): body con JSON mal formado
  if (err.type === "entity.parse.failed") {
    return { status: 400, message: "Invalid JSON body" };
  }

  // Mongoose: validación o id con formato incorrecto
  if (err.name === "ValidationError") {
    return { status: 400, message: err.message };
  }
  if (err.name === "CastError") {
    return { status: 400, message: `Invalid value for ${err.path}` };
  }

  // Otros errores de cliente (4xx) que ya traen su propio código
  const status = err.status || err.statusCode;
  if (status >= 400 && status < 500) {
    return { status, message: err.expose ? err.message : "Bad request" };
  }

  return { status: 500, message: "Internal server error" };
};

module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    const { status, message } = getErrorResponse(err);

    // Errores del servidor: log completo. Errores del cliente: una línea
    if (status >= 500) {
      console.error("ERROR", req.method, req.path, err);
    } else {
      console.warn(`${status} ${req.method} ${req.path}: ${message}`);
    }

    // only respond if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });
};
