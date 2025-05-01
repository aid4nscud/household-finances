import React from 'react';
import { AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface FormErrorProps {
  error: string;
  retry?: () => void;
}

export function FormError({ error, retry }: FormErrorProps) {
  const isDatabaseError = error.toLowerCase().includes('database') || 
                          error.toLowerCase().includes('supabase');
  
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 my-6 flex flex-col items-center text-center">
      <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
        {isDatabaseError ? (
          <Database className="h-6 w-6 text-destructive" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-destructive" />
        )}
      </div>
      
      <h3 className="text-lg font-medium text-destructive mb-2">
        {isDatabaseError ? 'Database Connection Error' : 'Form Submission Error'}
      </h3>
      
      <p className="text-muted-foreground mb-4 max-w-md">
        {isDatabaseError ? (
          <>
            We're having trouble connecting to our database. This could be due to maintenance, 
            a temporary outage, or missing database tables.
          </>
        ) : (
          error || 'There was an error processing your submission. Please try again.'
        )}
      </p>
      
      {isDatabaseError && (
        <div className="bg-card p-3 rounded text-sm text-left w-full max-w-md mb-4 overflow-x-auto">
          <code className="text-xs">{error}</code>
        </div>
      )}
      
      {retry && (
        <Button 
          onClick={retry} 
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
} 