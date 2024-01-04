const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require('bcrypt');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

class User {
    constructor({ email, password, name, username }) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    /**
     * Register a new user in the database.
     * @returns {Promise} A promise that resolves with the registered user or rejects with an error.
     */
    async registerUser() {
        return new Promise(async (resolve, reject) => {
            try {
                const hashPassword = await bcrypt.hash(this.password, Number(process.env.SALT));

                const userObj = new UserSchema({
                    name: this.name,
                    email: this.email,
                    username: this.username,
                    password: hashPassword,
                });

                const userDb = await userObj.save();
                resolve(userDb);
            } catch (error) {
                console.error("Error registering user:", error);
                reject(error);
            }
        });
    }

    /**
     * Verify if a username or email already exists in the database.
     * @param {Object} params - Parameters.
     * @param {string} params.email - The email to check.
     * @param {string} params.username - The username to check.
     * @returns {Promise} A promise that resolves with null or rejects with an error message.
     */
    static async verifyUsernameAndEmailExist({ email, username }) {
        return new Promise(async (resolve, reject) => {
            try {
                const userExists = await UserSchema.findOne({
                    $or: [{ email }, { username }],
                });

                if (userExists && userExists.email === email) {
                    reject("Email Already Exists");
                }

                if (userExists && userExists.username === username) {
                    reject("Username Already Exists");
                }

                resolve(null);

            } catch (error) {
                console.error("Error in verifyUsernameAndEmailExist:", error);
                reject(new Error("Database error"));
            }
        });
    }

    /**
     * Find a user by their email or username.
     * @param {Object} params - Parameters.
     * @param {string} params.loginId - The email or username to search for.
     * @returns {Promise} A promise that resolves with the found user or rejects with an error.
     */
    static async findUserEmailUsername({ loginId }) {
        return new Promise(async (resolve, reject) => {
            try {
                const userDb = await UserSchema.findOne({
                    $or: [{ email: loginId }, { username: loginId }],
                });

                if (!userDb) reject("User does not exist");

                resolve(userDb);
            } catch (error) {
                console.error("Error finding user by email or username:", error);
                reject(error);
            }
        });
    }

    /**
     * Verify if a user ID is valid and exists in the database.
     * @param {Object} params - Parameters.
     * @param {string} params.userId - The ID of the user to verify.
     * @returns {Promise} A promise that resolves with the verified user or rejects with an error.
     */
    static async verifyUserId({ userId }) {
        return new Promise(async (resolve, reject) => {
            if (!ObjectId.isValid(userId)) reject('Invalid userId format');

            try {
                const userDb = await UserSchema.findById(userId);

                if (!userDb) reject(`No user found with userId: ${userId}`);

                resolve(userDb);
            } catch (error) {
                console.error("Error verifying user by ID:", error);
                reject(error);
            }
        });
    }
}

module.exports = User;
