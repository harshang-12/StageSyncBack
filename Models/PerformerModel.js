const mongoose = require('mongoose');

const performerSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    phoneNo: {
        type: String
    }
    ,
    interest: {
        type: String, // Add interest field
    },
    qualification: {
        type: String // Add qualification field
    },
    successStory: {
        type: String
    },
    image: {
        type: String // Assuming you want to store a single image URL
    }


    // Add any additional fields specific to performers
});

const PerformerModel = mongoose.model('Performer', performerSchema);

module.exports = PerformerModel;