export function generateEmailTemplate({ name, report }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Financial Report</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">Financial Report</h1>
              <p style="color: #666666; margin-top: 10px;">Prepared for ${name}</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h2 style="color: #1e40af; font-size: 18px; margin-bottom: 15px;">Your Financial Insights</h2>
              ${report.split('\n\n').map(insight => `
                <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 15px; border-radius: 4px;">
                  <p style="margin: 0;">${insight}</p>
                </div>
              `).join('')}
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #666666; font-size: 14px; margin: 0;">
                This report is based on the information you provided and should be used as general guidance only. 
                For specific financial advice, please consult with a qualified financial advisor.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666666; font-size: 12px;">
              This email was sent automatically. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
} 