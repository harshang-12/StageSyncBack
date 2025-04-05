const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const OrganizerModel = require('../Models/OrganizerModel');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'stagesync058@gmail.com',
        pass: 'ikmy cuae mdyp qkil'
    }
});

// Route for organizer to send email to performer
router.post('/sendOrgEmail', async (req, res) => {
    try {
        const { organizerAndScheduleDetail, performerDetail } = req.body;

        let OrganizerEmail = organizerAndScheduleDetail.organizer.email
        let Organizerusername = organizerAndScheduleDetail?.organizer?.username

        let performerName = performerDetail?.username
        let performerId = performerDetail.userId
        let performerPhoneNo = performerDetail.phoneNo
        let performerEmail = performerDetail.email
        let performerIntrest = performerDetail.interest

        // console.log(organizerAndScheduleDetail ,performerDetail )

        // // Define email options
        let mailOptions = {
            from: 'stagesync058@gmail.com',
            to: OrganizerEmail,
            subject: `${performerName}'s Participation Confirmation for Your Event - Please Verify, ${Organizerusername}`,
            text: ``,
            html: `<h2> ${performerName}</h2>
      <h4>Phone No : ${performerPhoneNo}</h4>  
           <h4>Email : ${performerEmail}</h4> 
            <h4>Interest : ${performerIntrest}</h4>
            <a href='http://localhost:5173/pfm/profile/${performerId}'>Check Profile Here</a>
           `
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Failed to send email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to send email');
    }
});




module.exports = router;