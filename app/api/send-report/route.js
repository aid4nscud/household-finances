import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateEmailTemplate } from '../../../utils/emailTemplate';

export async function POST(request) {
  try {
    const { name, email, report } = await request.json();

    if (!name || !email || !report) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Generate email HTML
    const htmlContent = generateEmailTemplate({ name, report });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Personal Financial Report',
      html: htmlContent
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 