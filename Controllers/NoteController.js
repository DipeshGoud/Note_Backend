const express = require('express');
const { NoteDataValidate } = require('../Utils/NoteUtils');
const User = require('../Models/UserModel');
const Note = require('../Models/NoteModel');
const mongoose = require('mongoose');

const NoteRouter = express.Router();

// Create a new note
NoteRouter.post('/create-note', async (req, res) => {
    const { title, content } = req.body;
    const userId = req.session.user.userId;

    // Data validation
    try {
        await NoteDataValidate({ title, content, userId });
        await User.verifyUserId({ userId });
    } catch (error) {
        return res.status(400).send({
            message: "Data validation error!!",
            error: error
        });
    }

    try {
        const noteObj = new Note({
            title,
            content,
            userId,
            creationDateTime: new Date()
        });

        const noteDb = await noteObj.createNote();

        res.status(201).send({
            message: "Note created successfully!!",
            noteDb
        });
    } catch (error) {
        return res.status(500).send({
            message: "Note creation error!! (Database error)",
            error: error
        });
    }
});

// Get all notes
NoteRouter.get('/get-notes', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    try {
        const notes = await Note.getNotesByUserId({ userId: req.session.user.userId, page, limit: 10, sortBy: 'creationDateTime', sortOrder: 'desc' });
        res.status(200).send({
            message: "Notes fetched successfully!!",
            data: notes
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Note fetching error!!",
            error: error
        });
    }
});

// Get a specific note
NoteRouter.get('/get-note/:noteId', async (req, res) => {
    const noteId = req.params.noteId;
    try {
        const note = await Note.getNoteById({ noteId });

        if (!note) {
            return res.status(404).send({
                message: "Note not found",
                data: null
            });
        }

        res.status(200).send({
            message: "Note fetched successfully!!",
            data: note
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Note fetching error!!",
            error: error
        });
    }
});

// Get notes for a specific user
NoteRouter.get('/get-notes-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const SKIP = parseInt(req.query.skip) || 0;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
            message: "Invalid userId format",
            error: "Invalid userId format"
        });
    }

    try {
        const notes = await Note.getNotesByUserId({ SKIP, userId });

        if (notes.length === 0) {
            return res.status(404).send({
                message: "No notes found for the user",
                data: null
            });
        }

        res.send({
            message: "Notes fetched successfully!!",
            data: notes
        });
    } catch (error) {
        return res.status(500).send({
            message: "Note fetching error!!",
            error: error
        });
    }
});

// Delete a note
NoteRouter.delete('/delete-note/:noteId', async (req, res) => {
    const noteId = req.params.noteId;
    try {
        const note = await Note.deleteNoteById({ noteId });
        res.send({
            message: "Note deleted successfully!!",
            data: note
        });
    } catch (error) {
        return res.status(400).send({
            message: "Note deletion error!!",
            error: error
        });
    }
});

// Update a note
NoteRouter.put('/update-note/:noteId', async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content } = req.body;
    try {
        const note = await Note.updateNoteById({ noteId, title, content });
        res.send({
            message: "Note updated successfully!!",
            data: note
        });
    } catch (error) {
        return res.status(400).send({
            message: "Note updating error!!",
            error: error
        });
    }
});

module.exports = NoteRouter;
