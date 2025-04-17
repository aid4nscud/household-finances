'use client';

import { useState } from 'react';
import DynamicForm from '../components/DynamicForm';
import { calculateReport } from '../utils/calculateReport';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      // Generate the report
      const report = calculateReport(formData);

      // Send the report via email
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          report
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          message: 'Your financial report has been generated and sent to your email!'
        });
      } else {
        throw new Error(data.error || 'Failed to send report');
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: `Error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Household Finance Report
          </h1>
          <p className="text-gray-600">
            Fill out the form below to receive your personalized financial insights
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <DynamicForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {feedback.message && (
          <div
            className={`rounded-md p-4 ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
        )}
      </div>
    </div>
  );
} 