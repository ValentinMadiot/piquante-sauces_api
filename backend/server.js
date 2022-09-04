//* IMPORT LIBRAIRIE
const express = require("express")
const cors = require('cors')
const path = require('path')
require('dotenv').config()

//* IMPORT DATABASE
require('./services/database')

//* IMPORT ROUTE
const userRoute = require('./routes/user')
const sauceRoute = require('./routes/sauce')

const app = express()
const port = 3000

//* MIDDLEWARE
app.use(cors())
app.use(express.json())

//* ROUTES
app.use(userRoute)
app.use(sauceRoute)

//* CHEMIN IMAGE
app.use('/images', express.static(path.join(__dirname, '/images')))

//* ECOUTE DU PORT
app.listen(port, () => console.log("Listening on port : " + port))

module.exports = app