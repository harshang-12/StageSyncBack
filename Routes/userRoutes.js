const express = require('express');
const router = express.Router();
const UserModel = require('../Models/Users');
const OrganizerModel = require('../Models/OrganizerModel');
const PerformerModel = require('../Models/PerformerModel');

router.get("/", async (req, res) => {
    try {
        const getallRegesterData = await UserModel.find({});
        res.json(getallRegesterData);
    } catch (err) {
        res.json(err);
    }
});



router.delete("/deleteUser/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by userId
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Delete the user from UserModel
        await UserModel.findByIdAndDelete(userId);

        // Delete associated organizer or performer
        if (user.chooseTerm == 1) {
            await OrganizerModel.findOneAndDelete({ userId: userId });
        } else if (user.chooseTerm == 2) {
            await PerformerModel.findOneAndDelete({ userId: userId });
        }

        res.json({ success: true, message: "User deleted successfully", user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});



module.exports = router;
