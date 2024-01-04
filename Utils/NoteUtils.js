// Validate and clean up note data
const NoteDataValidate = ({ title, content, userId }) => {
    return new Promise((resolve, reject) => {
        // Check for missing data
        if (!title || !content || !userId) {
            reject('Invalid data');
        }

        // Validate title datatype
        if (typeof title !== 'string') {
            reject('Title is not a string');
        }

        // Validate content datatype
        if (typeof content !== 'string') {
            reject('Content is not a string');
        }

        resolve();
    });
};

module.exports = { NoteDataValidate };
