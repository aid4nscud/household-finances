import nodemailer from 'nodemailer';
import emailTemplate from '../../utils/emailTemplate';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, report } = req.body;

    // Validate input
    if (!name || !email || !report) {
      return res.status(400).json({ error: 'Name, email, and report are required' });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Create a transporter using Gmail and app password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Generate HTML email content
    const htmlContent = emailTemplate(name, report);

    // Email options
    const mailOptions = {
      from: `"Household Finances" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Personal Financial Report',
      text: report, // Plain text version
      html: htmlContent, // HTML version
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
} 