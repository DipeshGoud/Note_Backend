const express = require('express');
const AuthRouter = express.Router();
const { cleanUpAndValidateRegister, cleanUpAndValidateLogin } = require('../Utils/AuthUtils');
const User = require('../Models/UserModel');
const bcrypt = require('bcrypt');
const { isAuth } = require('../Middlewares/AuthMiddleware');

// Registration route
AuthRouter.post('/register', async (req, res) => {
    const { username, password, name, email } = req.body;

    try {
        // Validate user input
        console.log("Validating user input");
        await cleanUpAndValidateRegister({ username, password, name, email });
        console.log("User input validated");
    } catch (error) {
        console.error("Data validation error:", error);
        return res.status(400).send({
            status: 400,
            message: "Data validation error!!",
            error: error
        });
    }

    try {
        // Check if email or username already exists
        console.log("Verifying if email or username exists");
        await User.verifyUsernameAndEmailExist({ email, username });
        console.log("Verification successful");

        // Register user in the database
        console.log("Creating user object");
        const userObj = new User({ name, email, password, username });
        console.log("User object created");

        console.log("Registering user in the database");
        const userDb = await userObj.registerUser();
        console.log("User registered");

        return res.status(201).send({
            status: 201,
            message: "Registration successful!!",
            data: userDb
        });

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send({
            status: 500,
            message: "Database error!!",
            error: error
        });
    }
});

// Login route
AuthRouter.post('/login', async (req, res) => {
    const { loginId, password } = req.body;

    try {
        // Clean up and validate login input
        console.log("validating login input");
        await cleanUpAndValidateLogin({ loginId, password });
        console.log("Login input validated");

        console.log("Verifying if email or username exists");
        const userDb = await User.findUserEmailUsername({ loginId });
        console.log("Verification successful");

        console.log("Comparing Password");
        const isMatch = await bcrypt.compare(password, userDb.password);
        console.log("Password Compared");

        if (!isMatch) {
            console.log("Password Incorrect!!");
            return res.status(400).send({
                status: 400,
                message: "Validation error!!",
                error: "Password is Incorrect!! "
            });
        }

        // Set session variables
        req.session.isAuth = true;
        req.session.user = {
            userId: userDb.id,
            username: userDb.username,
            email: userDb.email,
        };

        console.log("Password Correct!!");
        return res.status(200).send({
            status: 200,
            message: "Login Successful!!"
        });

    } catch (error) {
        console.error(error);
        return res.status(400).send({
            message: "Data related error",
            error: error.message
        });
    }
});

// Logout route
AuthRouter.post('/logout', isAuth, async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: "Logout unsuccessful!!",
                error: err,
            });
        }

        return res.send({
            status: 200,
            message: "Logout successful!!",
        });
    });
});

module.exports = AuthRouter;
