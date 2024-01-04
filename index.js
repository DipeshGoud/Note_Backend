const express = require('express');
const clc = require('cli-color');
require('dotenv').config();
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);
const store = new mongoDbSession({
    uri: process.env.MONGODB_URI,
    collection: "Sessions"
});

// File Import
const db = require('./db');
const AuthRouter = require('./Controllers/AuthController');
const NoteRouter = require('./Controllers/NoteController');
const { isAuth } = require('./Middlewares/AuthMiddleware');

// Const
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Session-base-auth
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
}));

// Routes
app.use('/auth', AuthRouter);

// Protected routes with authentication middleware
app.use('/note', isAuth, NoteRouter);

// Default route
app.get("/", (req, res) => {
    console.log("Welcome to Server!!");
    res.send("Welcome to Server!!");
});

// Start the server
app.listen(PORT, () => {
    console.log(clc.yellow(`Server is running on port ${PORT}`));
});
