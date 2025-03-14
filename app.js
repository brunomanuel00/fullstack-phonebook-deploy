const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/person')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

const url = config.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)

    .then(_result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('dist'))

app.use(express.json())
app.use(middleware.morganMiddleware)

app.use('/api', personsRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app