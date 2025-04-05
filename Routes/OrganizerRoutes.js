const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const OrganizerModel = require('../Models/OrganizerModel'); // Import OrganizerModel instead of PerformerModel


const multer = require('multer');
const path = require('path');
const fs = require('fs');
const UserModel = require('../Models/Users');

const url = "http://localhost:3001";

// Route to get an organizer by ID
router.get('/organizers/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the userId is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    const user = await UserModel.findById(id).select('-password -chooseTerm');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found for the given userId' });
    }


    // Find the organizer based on userId
    const organizer = await OrganizerModel.findOne({ userId: id });

    if (!organizer) {
      return res.status(404).json({ success: false, message: 'Organizer not found for the given userId' });
    }

    // Fetch the user details manually

    // Combine the organizer and user data
    const result = {
      profileData: organizer,
      user,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





// Route to get all organizers
router.get('/organizers', async (req, res) => {
  try {
    const organizers = await OrganizerModel.find();
    res.json({ success: true, organizers: organizers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to update an organizer by userId

// router.post('/updateOrganizerById/:id', upload.single('image'), async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const updateFields = req.body;

//     // Check if userId is a valid ObjectId
//     if (!ObjectId.isValid(userId)) {
//       return res.status(400).json({ success: false, message: 'Invalid userId' });
//     }

//     // Convert userId to ObjectId
//     const objectIdUserId = new ObjectId(userId);

//     // Construct the update object
//     const updateObject = { ...updateFields };

//     // Check if image was uploaded
//     if (req.file) {
//       updateObject.image = '/uploads/' + req.file.filename; // Set the image field in the update object
//     }

//     // Update the organizer based on userId
//     const updatedOrganizer = await OrganizerModel.findOneAndUpdate(
//       { userId: objectIdUserId, chooseTerm: "1" }, // Find organizer by userId and chooseTerm
//       updateObject, // Update fields
//       { new: true } // Return the updated document
//     );

//     if (!updatedOrganizer) {
//       return res.status(404).json({ success: false, message: 'Organizer not found for the given userId and chooseTerm' });
//     }

//     res.json({ success: true, organizer: updatedOrganizer });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });


// Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})


const upload = multer({ storage });

router.post('/updateOrganizerById/:id', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.id;
    const updateFields = req.body;

    // Check if userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // Convert userId to ObjectId
    const objectIdUserId = userId;

    // Construct the update object
    const updateObject = { ...updateFields };

    // Check if image was uploaded
    if (req.file) {
      updateObject.image = `${url}/uploads/` + req.file.filename; // Set the image field in the update object
    }



    // Update the organizer based on userId
    const updatedOrganizer = await OrganizerModel.findOneAndUpdate(
      { userId: objectIdUserId }, // Find organizer by userId and chooseTerm
      updateObject, // Update fields
      { new: true } // Return the updated document
    );

    if (!updatedOrganizer) {
      return res.status(404).json({ success: false, message: 'Organizer not found for the given userId and chooseTerm' });
    }

    res.json({ success: true, organizer: updatedOrganizer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});






// Route to delete an organizer by userId
router.delete('/organizers/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if userId is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // Convert userId to ObjectId
    const objectIdUserId = new ObjectId(userId);

    // Delete the organizer based on userId
    const deletedOrganizer = await OrganizerModel.findOneAndDelete({ userId: objectIdUserId, chooseTerm: "1" });

    if (!deletedOrganizer) {
      return res.status(404).json({ success: false, message: 'Organizer not found for the given userId and chooseTerm' });
    }

    res.json({ success: true, message: 'Organizer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});






router.get('/uploads/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Read the file and send it as a response
      res.sendFile(filePath);
    } else {
      // If the file does not exist, return a 404 error
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
