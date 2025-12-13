const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const { subscribeToQueue, connect } = require('./service/rabbit');

// Create transporter ONCE
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD
  }
});

const sendEmail = async () => {
  await subscribeToQueue('appointment_created', async (msg) => {
    const appointmentDetail = JSON.parse(msg);
    console.log('Received appointment detail:', appointmentDetail);

    const mailOptions = {
      from: process.env.APP_USER,
      to: [
        appointmentDetail.patientEmail,
        appointmentDetail.doctorEmail
      ],
      subject: 'New Appointment Created',
      text: `Dear ${appointmentDetail.patientName} and Dr. ${appointmentDetail.doctorName},

Your appointment has been scheduled on ${appointmentDetail.date} at ${appointmentDetail.time}.

Reason: ${appointmentDetail.reason}

Thank you.`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to', mailOptions.to);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
};

connect()
  .then(sendEmail)
  .catch((err) => {
    console.error('Error in setting up email notifications:', err);
  });
