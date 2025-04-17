/**
 * Generates a styled HTML email template with the financial report
 * @param {string} name - User's name
 * @param {string} report - The financial report text
 * @returns {string} - HTML content for the email
 */
function emailTemplate(name, report) {
  // Replace newlines with <br> for HTML display
  const formattedReport = report
    .replace(/\n/g, '<br>')
    .replace(/•/g, '&bull;') // Convert bullet points
    .replace(/KEY INSIGHTS:/g, '<strong style="color:#1e3a8a;font-size:16px;">KEY INSIGHTS:</strong>')
    .replace(/RECOMMENDATIONS:/g, '<strong style="color:#1e3a8a;font-size:16px;">RECOMMENDATIONS:</strong>')
    .replace(/ALERT:/g, '<strong style="color:#dc2626;">ALERT:</strong>')
    .replace(/POSITIVE:/g, '<strong style="color:#10b981;">POSITIVE:</strong>')
    .replace(/RECOMMENDATION:/g, '<strong style="color:#1e40af;">RECOMMENDATION:</strong>');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Financial Report</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f0f4f8; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e3a8a; margin: 0; font-size: 24px;">Your Personal Financial Report</h1>
          <p style="color: #64748b; font-size: 16px; margin-top: 5px;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background-color: white; border-radius: 6px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
          <p style="margin-top: 0; font-size: 16px;">Hello ${name},</p>
          <p style="font-size: 16px;">Thank you for using our household finances tool. Below is your personalized financial report based on the information you provided.</p>
        </div>
        
        <div style="background-color: white; border-radius: 6px; padding: 25px; margin-bottom: 25px; font-size: 15px; line-height: 1.7;">
          ${formattedReport}
        </div>
        
        <div style="background-color: #eff6ff; border-radius: 6px; padding: 20px; font-size: 14px; color: #1e40af;">
          <p style="margin-top: 0;"><strong>Important Note:</strong> This report is based on the information you provided and is intended for informational purposes only. For professional financial advice, please consult with a certified financial planner.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b;">
          <p>&copy; ${new Date().getFullYear()} Household Finances App. All rights reserved.</p>
          <p>This email was sent to you because you requested a financial report.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default emailTemplate; 