# Income Statement Generator

A web application for generating personalized income statements to better understand your finances. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- User authentication with email magic links (OTP)
- Create personalized income statements
- View and analyze financial data with the 50/30/20 rule
- Store and view history of past statements
- Export statements to Excel
- Responsive design that works on all devices

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components:** Shadcn UI, Radix UI
- **Authentication:** Supabase Auth
- **Database:** Supabase PostgreSQL
- **Styling:** Tailwind CSS
- **Form Validation:** Zod, React Hook Form

## Authentication Architecture

### Middleware Implementation

This project follows Supabase's recommended approach for authentication with Next.js App Router:

1. **Simple Middleware**: We use the standard middleware approach recommended by Supabase, which focuses solely on refreshing the authentication session and managing cookies:

```typescript
// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

2. **Route Protection**: We protect routes at the page/layout level rather than in middleware:
   - `(main)` layout checks for authentication and redirects unauthenticated users to sign-in
   - Authentication pages redirect authenticated users to the dashboard

This approach simplifies the codebase and aligns with Supabase's best practices, ensuring easier maintenance and compatibility with Supabase updates.

### User Authentication Flow

1. **Sign-in/Sign-up**: User authenticates through the auth pages
2. **Session Refresh**: Middleware handles session cookie refresh automatically
3. **Route Access**: Protected routes check for valid authentication before rendering

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
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

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Visit the [Vercel Dashboard](https://vercel.com/dashboard) and click "New Project"

3. Import your repository and configure the following settings:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)

4. Add the following environment variables:
   ```
   # Supabase configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Base URL (will be used for auth redirects)
   NEXT_PUBLIC_BASE_URL=https://your-vercel-deployment-url.vercel.app
   ```

5. Click "Deploy"

### Configuring Supabase for Production

1. Go to your Supabase project dashboard
2. Navigate to Authentication → URL Configuration
3. Update the Site URL to match your Vercel deployment URL
4. Add the redirect URL: `https://your-vercel-deployment-url.vercel.app/auth/callback`
5. Save changes

### Verifying Your Deployment

After deployment:
1. Test authentication flow by signing in
2. Verify that redirection works correctly after authentication
3. Test creating and viewing income statements

### Troubleshooting Deployment Issues

#### Authentication Problems
- **Redirect Loop**: If you're experiencing redirect loops, verify that your `NEXT_PUBLIC_BASE_URL` is set correctly and matches your actual deployment URL.
- **Magic Link Not Working**: Check that your Supabase redirect URL is correctly configured in the Supabase dashboard.
- **Cookie Issues**: Ensure cookies are working on your domain. For custom domains, make sure they're properly set up in Vercel.

#### Environment Variables
- Make sure all environment variables are properly set in the Vercel dashboard.
- For local testing of production builds, create a `.env.production.local` file with the same variables.
- Verify that the `NEXT_PUBLIC_` prefix is used for all client-side variables.

#### Supabase Connection Issues
- Check that your Supabase project is on a plan that supports your expected traffic.
- Verify network rules if you're experiencing timeouts or connection issues.
- Test Supabase connection using the auth debug route: `/auth-debug`

#### Deployment Fails
- Check Vercel build logs for specific errors.
- Ensure your Node.js version is compatible (this project requires Node.js 18+).
- Try increasing build memory limit if you're experiencing out-of-memory errors.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 