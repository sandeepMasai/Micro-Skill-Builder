const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await sendEmail(
      process.env.SMTP_USER,
      `New Contact Form Message from ${name}`,
      `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`
    );

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

module.exports = router;
