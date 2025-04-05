const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../Models/Users');
const OrganizerModel = require('../Models/OrganizerModel');
const PerformerModel = require('../Models/PerformerModel');

router.post("/register", async (req, res) => {
    try {
        const { username, email, chooseTerm, password } = req.body;

        // Check if email already exists
        const existingEmail = await UserModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({
                status: false,
                message: "Email already exists. Please use a different email."
            });
        }

        // Check if username already exists
        const existingUsername = await UserModel.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({
                status: false,
                message: "Username already exists. Please choose a different username."
            });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Create user in UserModel
        const user = await UserModel.create({
            username: username,
            email: email,
            chooseTerm: chooseTerm,
            password: hash
        });

        // Create performer or organizer using the same userId (which is _id of the user)
        let newUser;
        if (chooseTerm == 1) {
            // Create organizer in OrganizerModel
            newUser = await OrganizerModel.create({
                userId: user._id, // Use the _id of the created user
                // username: username,
                // email: email,
                // chooseTerm: chooseTerm
            });
        } else if (chooseTerm == 2) {
            // Create performer in PerformerModel
            newUser = await PerformerModel.create({
                userId: user._id, // Use the _id of the created user
                // username: username,
                // email: email,
                // chooseTerm: chooseTerm
            });
        } else {
            throw new Error("Invalid chooseTerm value");
        }

        res.json({ status: true, newUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: false, message: err.message });
    }
});

module.exports = router;
