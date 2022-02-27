const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const connectDB = require('./config/database')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5001

connectDB()

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/wishes', require('./routes/wishRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))