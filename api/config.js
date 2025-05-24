const port = process.env.PORT || 8080;

const errorHandler = (server, error) => {
  if (error.syscall !== "listen") throw error;

  const address = server.address();
  const bind = typeof address === "string" ? `pipe ${address}` : `port ${port}`;

  const messages = {
    EACCES: `${bind} nécessite des privilèges élevés.`,
    EADDRINUSE: `${bind} est déjà utilisé.`,
  };

  if (messages[error.code]) {
    console.error("❌ " + messages[error.code]);
    process.exit(1);
  } else {
    throw error;
  }
};

module.exports = {
  port,
  errorHandler,
};
