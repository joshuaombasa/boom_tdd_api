const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const warehousesRouter = require('./controllers/warehouses')
const loginRouter = require('./controllers/login')
const ownersRouter = require('./controllers/owners')

const app = express()


mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
        .then(() => logger.info('connected to MongoDB'))
        .catch(error => logger.error(error.message))


app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)

app.use('/api/warehouses', warehousesRouter)
app.use('/api/login', loginRouter)
app.use('/api/owners', ownersRouter)

app.use(middleware.unknownEndpointHandler)
app.use(middleware.errorHandler)


module.exports = app