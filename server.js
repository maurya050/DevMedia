const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false })); // Body parser

app.get('/', (req, res) => {
    res.send("API Running");
});

// Define Routes
app.use('/api/users', require('./routes/api/users'));     // / => /api/users
app.use('/api/auth', require('./routes/api/auth'));       // / => /api/auth
app.use('/api/profile', require('./routes/api/profile')); // / => /api/profile
app.use('/api/posts', require('./routes/api/posts'));     // / => /api/posts

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server started at port : ${PORT}`) )