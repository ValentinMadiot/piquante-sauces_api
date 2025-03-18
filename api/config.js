exports.port = process.env.PORT || 8080;
exports.errorHandler = (server, error) => {
  if (error.syscall !== "listen") throw error;
  const bind =
    typeof server.address() === "string"
      ? "pipe " + server.address()
      : "port " + exports.port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} nécessite des privilèges élevés.`);
      process.exit(1);
    case "EADDRINUSE":
      console.error(`${bind} est déjà utilisé.`);
      process.exit(1);
    default:
      throw error;
  }
};
