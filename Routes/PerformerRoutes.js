const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const PerformerModel = require('../Models/PerformerModel');
const UserModel = require('../Models/Users');



const multer = require('multer');
const path = require('path');
const fs = require('fs');
const url = "http://localhost:3001";


// Route to get a performer by ID
router.get('/performers/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if userId is a valid ObjectId
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }

        // Convert userId to ObjectId
        const user = await UserModel.findById(userId).select('-password -chooseTerm');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found for the given userId' });
        }

        const performer = await PerformerModel.findOne({ userId: userId });

        if (!performer) {
            return res.status(404).json({ success: false, message: 'Performer not found for the given userId and chooseTerm' });
        }

        const result = {
            profileData: performer,
            user,
        };

        res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to get all performers
router.get('/performers', async (req, res) => {
    try {
        const performers = await PerformerModel.find();
        res.json({ success: true, performers: performers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to update a performer by userId
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})




const upload = multer({ storage });


router.post('/UpdatePerformersById/:id', upload.single('image'), async (req, res) => {
    try {
        const userId = req.params.id;
        const updateFields = req.body;


        // Check if userId is a valid ObjectId
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }

        // Convert userId to ObjectId
        const objectIdUserId = new ObjectId(userId);

        // Construct the update object
        const updateObject = { ...updateFields };

        if (req.file) {
            updateObject.image = `${url}/uploads/` + req.file.filename; // Set the image field in the update object
        }


        // Update the performer based on userId
        const updatedPerformer = await PerformerModel.findOneAndUpdate(
            { userId: objectIdUserId }, // Find organizer by userId and chooseTerm
            updateObject, // Update fields
            { new: true } // Return the updated document
        );
        if (!updatedPerformer) {
            return res.status(404).json({ success: false, message: 'Performer not found for the given userId and chooseTerm' });
        }

        res.json({ success: true, performer: updatedPerformer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to delete a performer by userId
router.delete('/performers/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if userId is a valid ObjectId
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid userId' });
        }

        // Convert userId to ObjectId
        const objectIdUserId = new ObjectId(userId);


        // Delete the performer based on userId
        const deletedPerformer = await PerformerModel.findOneAndDelete({ userId: objectIdUserId, chooseTerm: "2" });

        if (!deletedPerformer) {
            return res.status(404).json({ success: false, message: 'Performer not found for the given userId and chooseTerm' });
        }

        res.json({ success: true, message: 'Performer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
