const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const animalsRouter = require('./animals/animals-router')
const app = express()

app.use(morgan('common'))
app.use(cors())

app.use('/api/animals', animalsRouter)

app.get('/', (req, res) => {
    res.send('Hello world!!!!!!')
})



module.exports = app