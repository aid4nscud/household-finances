# Household Finance Report Generator

A Next.js web application that helps users analyze their household finances by collecting data through a dynamic form, generating personalized insights, and sending a beautifully formatted report via email.

## Features

- Dynamic form for collecting household financial data
- Real-time financial calculations and insights
- Goal-specific recommendations
- Beautifully styled email reports
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js 14.x or later
- Gmail account with App Password enabled

## Setup

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
cd household-finances
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file in the root directory with your Gmail credentials:
\`\`\`
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
\`\`\`

Note: For the EMAIL_PASS, you'll need to generate an App Password:
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled
4. Under "App passwords", generate a new app password
5. Use this generated password in your .env.local file

## Development

Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

Build the application:
\`\`\`bash
npm run build
\`\`\`

Start the production server:
\`\`\`bash
npm start
\`\`\`

## Technology Stack

- Next.js (JavaScript)
- Tailwind CSS
- Nodemailer
- Gmail SMTP

## Security Notes

- Never commit your .env.local file
- Use environment variables for sensitive data
- Keep your Gmail App Password secure
- Consider implementing rate limiting for the email API

## License

MIT 