const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));
connectDB();

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/test', require('./routes/test'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
