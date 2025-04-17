# Household Finances App

A Next.js web application that allows users to input their household financial information, generates personalized financial insights, and emails the report to the user.

## Features

- Dynamic form with validation
- Financial report generation with personalized insights
- Styled HTML email delivery
- Responsive UI with Tailwind CSS
- Real-time feedback on form submission

## Tech Stack

- Next.js (JavaScript)
- Tailwind CSS
- Nodemailer (for email functionality)
- Gmail for email delivery

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd household-finances
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-app-password
```

Note: You need to create an App Password for your Gmail account. Visit https://myaccount.google.com/apppasswords to generate one.

## Running the Application

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Build for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Application Structure

- `components/DynamicForm.js` - The form component with all input fields and validation
- `utils/calculateReport.js` - Calculates financial insights based on user inputs
- `utils/emailTemplate.js` - Generates a styled HTML template for the email
- `pages/index.js` - Main page that renders the form and processes form submission
- `pages/api/send-report.js` - API endpoint to handle sending emails with Nodemailer

## License

[MIT](LICENSE) 