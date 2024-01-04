const mongoose = require('mongoose');
const NoteSchema = require("../Schemas/noteSchema");

class Note {
    constructor({ title, content, userId, creationDateTime }) {
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.creationDateTime = creationDateTime;
    }

    /**
     * Create a new note in the database.
     * @returns {Promise} A promise that resolves with the created note or rejects with an error.
     */
    async createNote() {
        return new Promise(async (resolve, reject) => {
            try {
                const noteObj = new NoteSchema({
                    title: this.title,
                    content: this.content,
                    userId: this.userId,
                    creationDateTime: this.creationDateTime,
                });

                const noteDb = await noteObj.save();
                resolve(noteDb);
            } catch (error) {
                console.error("Error creating note:", error);
                reject(error);
            }
        });
    }

    /**
     * Retrieve a note by its ID.
     * @param {Object} params - Parameters.
     * @param {string} params.noteId - The ID of the note to retrieve.
     * @returns {Promise} A promise that resolves with the retrieved note or rejects with an error.
     */
    static async getNoteById({ noteId }) {
        return new Promise(async (resolve, reject) => {
            try {
                const note = await NoteSchema.findById(noteId);
                resolve(note);
            } catch (error) {
                console.error("Error retrieving note by ID:", error);
                reject(error);
            }
        });
    }

    /**
     * Retrieve notes by user ID with pagination and sorting options.
     * @param {Object} params - Parameters.
     * @param {string} params.userId - The ID of the user.
     * @param {number} [params.page=1] - The page number for pagination.
     * @param {number} [params.limit=10] - The number of notes to retrieve per page.
     * @param {string} [params.sortBy='creationDateTime'] - The field to sort notes by.
     * @param {string} [params.sortOrder='desc'] - The sort order ('asc' or 'desc').
     * @returns {Promise} A promise that resolves with the retrieved notes or rejects with an error.
     */
    static async getNotesByUserId({ userId, page = 1, limit = 10, sortBy = 'creationDateTime', sortOrder = 'desc' }) {
        return new Promise(async (resolve, reject) => {
            try {
                const sortOptions = {};
                sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

                const notes = await NoteSchema.find({ userId })
                    .sort(sortOptions)
                    .skip((page - 1) * limit)
                    .limit(limit);

                resolve(notes);
            } catch (error) {
                console.error("Error retrieving notes by user ID:", error);
                reject(error);
            }
        });
    };

    /**
     * Delete a note by its ID.
     * @param {Object} params - Parameters.
     * @param {string} params.noteId - The ID of the note to delete.
     * @returns {Promise} A promise that resolves with the deleted note or rejects with an error.
     */
    static async deleteNoteById({ noteId }) {
        return new Promise(async (resolve, reject) => {
            try {
                const note = await NoteSchema.findByIdAndDelete(noteId);
                resolve(note);
            } catch (error) {
                console.error("Error deleting note by ID:", error);
                reject(error);
            }
        });
    };

    /**
     * Update a note by its ID.
     * @param {Object} params - Parameters.
     * @param {string} params.noteId - The ID of the note to update.
     * @param {string} params.title - The updated title.
     * @param {string} params.content - The updated content.
     * @returns {Promise} A promise that resolves with the updated note or rejects with an error.
     */
    static async updateNoteById({ noteId, title, content }) {
        return new Promise(async (resolve, reject) => {
            try {
                const updatedNote = await NoteSchema.findByIdAndUpdate(noteId, { title, content }, { new: true });
                resolve(updatedNote);
            } catch (error) {
                console.error("Error updating note by ID:", error);
                reject(error);
            }
        });
    };
}

module.exports = Note;
