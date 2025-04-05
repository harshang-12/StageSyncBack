const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../Models/Users');


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                res.json({
                    data: {
                        id: user._id,
                        chooseTerm: user.chooseTerm,
                        username: user.username,
                    },
                    success: true,
                    message: 'Login successful...'
                });
            } else {
                res.json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        } else {
            res.json({ success: false, message: 'No records... please check your Email' });
        }
    } catch (err) {
        console.error(err.message);
        res.json(err);
    }
});





module.exports = router;
