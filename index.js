const express = require('express')
const routes = require('./routes/api/jobs')
const app = express()


app.use('/api/jobs', routes)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))