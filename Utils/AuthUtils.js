const validator = require("validator");

// Validate and clean up user registration data
const cleanUpAndValidateRegister = async ({ name, username, email, password }) => {
    return new Promise((resolve, reject) => {
        // Check for missing credentials
        if (!email || !name || !username || !password) {
            reject("Missing Credentials");
        }

        // Validate username datatype
        if (typeof username !== "string") reject("Invalid Datatype!! (Username must be a string)");

        // Validate name datatype
        if (typeof name !== "string") reject("Invalid Datatype!! (Name must be a string)");

        // Validate password datatype
        if (typeof password !== "string") reject("Invalid Datatype!! (Password must be a string)");

        // Check username length
        if (username.length <= 2 || username.length > 30) reject("Username length should be between 3-30 characters!!");

        // Check password length
        if (password.length <= 5 || password.length > 30) reject("Password length should be between 6-30 characters!!");

        // Check email format
        if (!validator.isEmail(email)) reject("Invalid email format");

        // Check password for alphanumeric characters
        if (!validator.isAlphanumeric(password)) reject("Password must contain numbers and letters");

        resolve();
    });
};

// Validate and clean up user login data
const cleanUpAndValidateLogin = async ({ loginId, password }) => {
    return new Promise((resolve, reject) => {
        console.log(loginId, password);
        // Check if loginId is an email
        if (validator.isEmail(loginId)) {
            // Validate password datatype
            if (typeof password !== "string") {
                reject({ message: "Invalid Datatype!! (Password must be a string)" });
            }

            // Check password length
            if (password.length <= 5 || password.length > 30) {
                reject({ message: "Password length should be between 6-30 characters!!" });
            }

            resolve();
        } else {
            // Validate loginId datatype
            if (typeof loginId !== "string") {
                reject({ message: "Invalid Datatype!! (Username must be a string)" });
            }

            // Validate password datatype
            if (typeof password !== "string") {
                reject({ message: "Invalid Datatype!! (Password must be a string)" });
            }

            // Check username length
            if (loginId.length <= 2 || loginId.length > 30) {
                reject({ message: "Username length should be between 3-30 characters!!" });
            }

            // Check password length
            if (password.length <= 5 || password.length > 30) {
                reject({ message: "Password length should be between 6-30 characters!!" });
            }

            resolve();
        }
    });
};

module.exports = { cleanUpAndValidateRegister, cleanUpAndValidateLogin };
