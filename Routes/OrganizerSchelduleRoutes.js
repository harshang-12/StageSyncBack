const express = require('express');
const router = express.Router();
const OrganizerScheduleModel = require('../Models/OrganizerScheduleModel'); // Importing the Mongoose model
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');



// POST route to create a new organizer schedule entry
router.post('/organizerSchedule', async (req, res) => {
    try {
        // Destructuring the request body to extract relevant fields
        const { userId, eventStartDate, eventName, eventEndDate, days, startTimePerDay, endTimePerDay, location, description } = req.body;

        // Create a new instance of the OrganizerScheduleModel
        const newSchedule = new OrganizerScheduleModel({
            userId,
            eventName,
            eventStartDate,
            eventEndDate,
            days,
            startTimePerDay,
            endTimePerDay,
            location,
            description
        });

        // Save the new schedule entry to the database
        await newSchedule.save();

        res.status(201).json({ message: 'Organizer schedule created successfully', data: newSchedule });
    } catch (error) {
        console.error('Error creating organizer schedule:', error);
        res.status(500).json({ message: 'Error creating organizer schedule' });
    }
});






router.get('/organizerSchedule', async (req, res) => {
    try {
        const schedules = await OrganizerScheduleModel.aggregate([
            {
                $lookup: {
                    from: 'organizers', // The name of the collection in the database
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'organizer'
                }
            },
            {
                $unwind: '$organizer' // Unwind the array created by the $lookup stage
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    eventName: 1,
                    eventStartDate: 1,
                    eventEndDate: 1,
                    days: 1,
                    startTimePerDay: 1,
                    endTimePerDay: 1,
                    location: 1,
                    description: 1,
                    organizer: {
                        _id: '$organizer._id',
                        username: '$organizer.username',
                        email: '$organizer.email',
                        chooseTerm: '$organizer.chooseTerm',
                        PhoneNo: '$organizer.PhoneNo',
                        Address: '$organizer.Address'
                    }
                }
            }
        ]);

        res.status(200).json({ message: 'Successfully fetched all organizer schedules', data: schedules });
    } catch (error) {
        console.error('Error fetching organizer schedules:', error);
        res.status(500).json({ message: 'Error fetching organizer schedules' });
    }
});


router.get('/UsersOrganizerSchedule/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        const objectId = new mongoose.Types.ObjectId(userId);

        const schedules = await OrganizerScheduleModel.aggregate([
            {
                $match: { userId: objectId }
            },
            {
                $lookup: {
                    from: 'organizers', // Make sure this is the correct collection name
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'organizer'
                }
            },
            { $unwind: '$organizer' },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    eventStartDate: 1,
                    eventName: 1,
                    eventEndDate: 1,
                    days: 1,
                    startTimePerDay: 1,
                    endTimePerDay: 1,
                    location: 1,
                    description: 1,
                    organizer: {
                        _id: '$organizer._id',
                        username: '$organizer.username',
                        email: '$organizer.email',
                        chooseTerm: '$organizer.chooseTerm',
                        PhoneNo: '$organizer.PhoneNo',
                        Address: '$organizer.Address'
                    }
                }
            }
        ]);

        res.status(200).json({
            message: 'Successfully fetched organizer schedules',
            data: schedules
        });
    } catch (error) {
        console.error('Error fetching organizer schedules:', error);
        res.status(500).json({ message: 'Error fetching organizer schedules' });
    }
});


router.get('/OrganizerSchedulegetById/:Id', async (req, res) => {
    try {
        const { Id } = req.params;

        // // Check if the provided ID is valid
        // if (!mongoose.Types.ObjectId.isValid(Id)) {
        //     return res.status(400).json({ message: 'Invalid ID format' });
        // }

        // Find the organizer schedule entry by ID
        const schedule = await OrganizerScheduleModel.findById(Id);

        if (!schedule) {
            return res.status(404).json({ message: 'Organizer schedule not found' });
        }

        res.status(200).json({ message: 'Successfully fetched organizer schedule', data: schedule });
    } catch (error) {
        console.error('Error fetching organizer schedule:', error);
        res.status(500).json({ message: 'Error fetching organizer schedule' });
    }
});



router.post('/organizer-schedule/:id', async (req, res) => {
    const { id } = req.params;
    // const { userId } = req.body; // Extract userId from the request body
    const updateFields = req.body; // Fields to update


    try {
        const updatedSchedule = await OrganizerScheduleModel.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updatedSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }
        return res.json({ message: 'Successfully Update organizer schedule', data: updatedSchedule });
    } catch (error) {
        console.error("Error updating schedule:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


router.delete('/organizerSchedule/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the provided ID is valid
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Find the organizer schedule entry by ID and delete it
        const deletedSchedule = await OrganizerScheduleModel.findByIdAndDelete(id);

        if (!deletedSchedule) {
            return res.status(404).json({ message: 'Organizer schedule not found' });
        }

        res.status(200).json({ message: 'Organizer schedule deleted successfully' });
    } catch (error) {
        console.error('Error deleting organizer schedule:', error);
        res.status(500).json({ message: 'Error deleting organizer schedule' });
    }
});



module.exports = router;

