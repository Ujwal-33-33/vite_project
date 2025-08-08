const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();
require('./config/passport-setup'); // Import passport configuration

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = 3000;

// --- Middleware ---
// CORS configuration to allow credentials and requests from the client
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite client's address
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Session Configuration ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Set to false, we'll save sessions only when a user logs in
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: false, // Set to true if you are using https
        httpOnly: true,
    }
}));

// --- Passport Initialization ---
app.use(passport.initialize());
app.use(passport.session());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---
app.use('/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// A simple route to check user's auth status from the client
app.get('/api/user', (req, res) => {
    if (req.user) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
