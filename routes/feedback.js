const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();
const GMAIL_AUTH = process.env.GMAIL_AUTH;

// Route to handle form submission
router.post('/submitFeedback', (req, res) => {
  try {
    const { useFrequency, feedback } = req.body;

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'somjeetsrimani2000@gmail.com',
        pass: `${GMAIL_AUTH}`,
      },
    });

    const mailOptions = {
      from: 'somjeetsrimani2000@gmail.com',
      to: 'somjeetsrimani2000@gmail.com',
      subject: 'New Feedback Received',
      text: `Usage Frequency: ${useFrequency}\n\nFeedback: ${feedback}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send('Error sending email');
      }
      res.status(200).send('Feedback submitted successfully');
    });
  } catch (error) {
    return response.status(400).send({ error: error.message });
  }
});

module.exports = router;
