const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: true
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // chooseTerm: {
    //     type: String,
    //     required: true
    // },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Storing ObjectId
        required: true,
        ref: 'UserModel' 
    },
    phoneNo: {
        type: String
    },
    address: {
        type: String
    },
    organizationName: {
        type: String
    },
    organizationType: {
        type: String // E.g., Corporation, Non-profit, etc.
    },
    additionalInfo: {
        type: String
    },
    image: {
        type: String // Assuming you want to store a single image URL
    }
    // Add any other organization-specific fields you need
});

const OrganizerModel = mongoose.model('Organizer', organizerSchema);

module.exports = OrganizerModel;