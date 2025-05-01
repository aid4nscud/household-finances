import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { IncomeStatement } from '../../types/index';
import emailTemplate from '../../utils/emailTemplate';
import { createServiceClient } from '@/lib/supabase';

type RequestData = {
  name: string;
  email: string;
  incomeStatement: IncomeStatement;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the request body
    const { name, email, incomeStatement } = req.body as RequestData;

    // Get the authenticated user from cookies
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ error: 'Unauthorized - No cookies found' });
    }

    // Use the service client to verify the session
    const adminClient = createServiceClient();
    const { data: { user }, error: authError } = await adminClient.auth.getUser(
      // Extract the auth token from cookies
      cookieHeader.split(';').find(c => c.trim().startsWith('sb-access-token='))?.split('=')[1]
    );

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid session' });
    }

    // Validate required fields
    if (!name || !email || !incomeStatement) {
      return res.status(400).json({ 
        error: 'Missing required fields (name, email, or income statement data)' 
      });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Store the report in Supabase
    const { error: insertError } = await adminClient
      .from('income_statements')
      .insert({
        user_id: user.id,
        user_name: name,
        user_email: email,
        statement_data: incomeStatement,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error storing report:', insertError);
      return res.status(500).json({ 
        error: 'Failed to store income statement. Please try again later.' 
      });
    }

    // Create email transport - use environment variables for security
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Prepare email subject and body
    const subject = `Your Income Statement - ${name}`;
    
    // Generate HTML email content from template
    const htmlContent = emailTemplate(incomeStatement, name);

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    await transport.sendMail(mailOptions);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Income statement has been sent to your email!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send income statement. Please try again later.' 
    });
  }
} 