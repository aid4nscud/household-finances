import { useState } from 'react';
import Head from 'next/head';
import DynamicForm from '../components/DynamicForm';
import calculateReport from '../utils/calculateReport';

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [report, setReport] = useState('');

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    setResponse(null);
    
    try {
      // Generate the report
      const generatedReport = calculateReport(formData);
      setReport(generatedReport);
      
      // Send the email
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          report: generatedReport,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send report');
      }
      
      setResponse({
        success: true,
        message: 'Financial report has been sent to your email!',
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error('Error sending report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setResponse(null);
    setError(null);
    setReport('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Head>
        <title>Household Finances Report</title>
        <meta name="description" content="Generate a personalized household finances report" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Household Finances</h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to get a personalized financial report emailed to you.
          </p>
        </div>

        {response?.success ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">{response.message}</p>
            
            {report && (
              <div className="mt-6 text-left bg-gray-50 p-4 rounded-md">
                <h3 className="font-bold text-lg mb-2 text-gray-800">Report Preview:</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {report}
                </pre>
              </div>
            )}
            
            <button
              onClick={resetForm}
              className="btn btn-primary mt-6"
            >
              Create Another Report
            </button>
          </div>
        ) : (
          <>
            <DynamicForm onSubmit={handleSubmit} isSubmitting={submitting} />
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="text-center text-gray-500 text-sm mt-12">
        &copy; {new Date().getFullYear()} Household Finances. All rights reserved.
      </footer>
    </div>
  );
} 