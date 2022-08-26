//*--------------------------------------------------------------------------------
//*----------------------------- CREATION SERVER NODE -----------------------------
//*--------------------------------------------------------------------------------

//* IMPORT FICHIER APP
const app = require('./app')

//* IMPORTATION PACKAGE HTTP NATIF DE NODE
const http = require('http')

//* DECLARE LE SERVEUR AVEC LE PACKAGE HTTP
const server = http.createServer(app)

require('./services/database')

//* RENVOI/GERE UN PORT VALIDE
const normalizePort = val => {
  const port = parseInt (val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

//* DECLARE LE PORT => 3000
const port = normalizePort(process.env.PORT || '3000')

//* LE PACKAGE HTTP UTILISE LE PORT 3000
app.set('Port :', port)

//* RECHERCHE LES DIFFERENTES ERREURS
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const adress = server.address()
  const bind = typeof adress === 'string' ? 'pipe' + adress : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break
    default: throw error
  }
}

//* RECHERCHE LES ERREURS SUR LE SERVEUR
server.on('error', errorHandler)

//* ECOUTEUR D'EVENEMENT
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})

//* ECOUTE LES REQUETES SUR LE SERVEUR
server.listen(port)