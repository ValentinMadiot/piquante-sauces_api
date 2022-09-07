//*--------------------------------------------------------------------------------
//*------------------------------------ CONFIG ------------------------------------
//*--------------------------------------------------------------------------------

//! GESTION DU PORT :
//* "normalizePort" => RENVOIE UN PORT VALIDE, QU'IL SOIT FOURNI SOUR LA FORME D'UN NUMERO OU D'UNE CHAINE
normalizePort = val => {
  const port = parseInt(val, 10)
  if (isNaN(port)) { return val }
  if (port >= 0) { return port }
  return false
}

//*--------------------------------------------------------------------------------

//! EXPORT DU PORT QUI EST PAR DEFAULT SUR 3000
exports.port = normalizePort(process.env.PORT || '3000')

//*--------------------------------------------------------------------------------

//! GESTION DES ERREURS :
//* "errorHandler" => RECHERCHE LES DIFFERENTES ERREURS ET LES GERES DE MANIERE APPROPRIEE
exports.errorHandler = error => {
  if (error.syscall !== 'listen') { throw error }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1);
      break
    default: throw error
  }
}