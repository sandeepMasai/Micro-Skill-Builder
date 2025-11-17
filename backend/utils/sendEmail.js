const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured. Email sending is disabled.');
    return Promise.resolve(); // Return resolved promise so it doesn't fail
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SkillForge" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error; // Re-throw so caller can handle it
  }
};

module.exports = sendEmail;
