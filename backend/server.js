const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5001

const app = express()

app.use('/', (req, res) => {
    res.json({message: 'This works'})
})

app.listen(port, () => console.log(`Server running on port ${port}`))