const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

// Init Middleware
app.use(express.json({ extended: false }))
app.use(cors())
connectDB()

// Define Routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/meals', require('./routes/meals'))
app.use('/api/meals/delete', require('./routes/meals/delete'))
app.use('/api/ingredients', require('./routes/ingredients'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
