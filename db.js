const mongoose = require('mongoose');
require('dotenv').config();
const clc = require('cli-color');

// Connect to MongoDB using the provided URI
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        // Log a message if the connection is successful
        console.log(clc.yellow('Connected to MongoDB'));
    })
    .catch((err) => {
        // Log any errors that occur during the connection process
        console.log(err);
    });
