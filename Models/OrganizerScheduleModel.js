const mongoose = require('mongoose');

const organizerScheduleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    eventName: {
        type : String,
        required :true
    },
    eventStartDate: {
        type: Date, // Assuming the event date is stored as a Date object
        required: true
    },
    eventEndDate: {
        type: Date, // Assuming the event date is stored as a Date object
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    startTimePerDay: {
        type: String, // Assuming the start time is stored as a string
        required: true
    },
    endTimePerDay: {
        type: String, // Assuming the end time is stored as a string
        required: true
    },
    location: {
        type: String, // Assuming the location of the event
        required: true
    },
    description: {
        type: String // Description of the event
    }

    // Add any additional fields specific to the organizer's schedule
});

const OrganizerScheduleModel = mongoose.model('OrganizerSchedule', organizerScheduleSchema);

module.exports = OrganizerScheduleModel;
