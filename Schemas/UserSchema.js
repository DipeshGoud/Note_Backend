const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the 'user' collection
const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    }
});

// Create a model using the schema, named "user", which will represent documents in the 'user' collection
module.exports = mongoose.model("user", userSchema);
