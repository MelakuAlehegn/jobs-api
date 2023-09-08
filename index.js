const express = require('express')
const routes = require('./routes/api/jobs')
const dotenv = require('dotenv').config()
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000

const app = express()

connectDB()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/jobs', routes)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))