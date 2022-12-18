//core module
const { readdirSync } = require('fs')
const path = require('path')

//installed module
const express = require('express')
const app = express()
const helmet = require('helmet')
const mongoose = require('mongoose')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./middleWares/errorMiddlewares')
const cookieParser = require('cookie-parser')

// middleware
app.use(helmet())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

// routes middleware
readdirSync('./routes').map((e) => app.use('/api/v1', require(`./routes/${e}`)))

// error handler
app.use(errorHandler)

// port
const PORT = process.env.port || 8000

mongoose
  .connect(process.env.database)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running port number ${PORT}`)
    })
  })
  .catch((err) => console.log(err))
