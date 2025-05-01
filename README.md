# Income Statement Generator

A web application for generating personalized income statements to better understand your finances. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- User authentication with email magic links (OTP)
- Create personalized income statements
- View and analyze financial data with the 50/30/20 rule
- Store and view history of past statements
- Export statements to Excel
- Email statements to users
- Responsive design that works on all devices

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components:** Shadcn UI, Radix UI
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Email:** Nodemailer
- **Styling:** Tailwind CSS
- **Form Validation:** Zod, React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Email service credentials (for sending statements)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email configuration
EMAIL_HOST=your-email-host
EMAIL_PORT=587
EMAIL_USERNAME=your-email-username
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=your-email-from
```

### Supabase Setup

1. Create a new Supabase project
2. Set up email authentication with magic links
3. Create the following tables:

```sql
-- Income statements table
CREATE TABLE income_statements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  statement_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE income_statements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own statements
CREATE POLICY "Users can view their own statements"
  ON income_statements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own statements
CREATE POLICY "Users can insert their own statements"
  ON income_statements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

Deploy the application using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fincome-statement-generator)

Make sure to add all the environment variables in your Vercel project settings.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 