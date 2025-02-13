const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'xxx@outlook.com',
    pass: 'xxx',
  },
});

app.get('/send-email', (req, res) => {
  // Email content
  const mailOptions = {
    from: 'xxx@outlook.com',
    to: 'xxx@outlook.com',
    subject: 'You got a new Apply for your Job Offer ',
    text: 'For more informations, connect to FakedIndeed on the Job Applicants page: http://localhost:3000/applicants.',
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Email not sent' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'Email sent successfully with ID: ' + info.messageId });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
