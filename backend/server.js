const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/database')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5001

connectDB()

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true,
    exposedHeaders: ['*', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(cookieParser())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/wishes', require('./routes/wishRoutes'))
app.use('/api/antiwishes', require('./routes/antiwishRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))