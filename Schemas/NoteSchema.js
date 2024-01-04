const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the 'note' collection
const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    content: {
        type: String,
        required: true,
    },
    creationDateTime: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});

// Create a model using the schema, named "note", which will represent documents in the 'note' collection
module.exports = mongoose.model("note", noteSchema);
