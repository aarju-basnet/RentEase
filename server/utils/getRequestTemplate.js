const getRequestTemplate = (ownerName, tenantName, propertyTitle, amount) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #f59e0b; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Booking Request! 🔔</h1>
      </div>
      
      <div style="padding: 30px; color: #333; line-height: 1.6;">
        <p style="font-size: 18px; margin-top: 0;">Hello <b>${ownerName}</b>,</p>
        
        <p>You have received a new booking request for your property: <b>${propertyTitle}</b>.</p>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">Request Details:</p>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
            <li><b>Tenant:</b> ${tenantName}</li>
            <li><b>Offered Amount:</b> NPR ${amount.toLocaleString()}</li>
          </ul>
        </div>

        <p>Please log in to your RentEase dashboard to review the tenant's profile, profession, and hometown before accepting the request.</p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${process.env.CLIENT_URI}/owner/dashboard" style="background-color: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Review Request</a>
        </div>

        <p style="font-size: 14px; color: #666;">Prompt responses help you close deals faster!</p>
      </div>

      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; 2026 RentEase Nepal. All rights reserved.</p>
      </div>
    </div>
  `;
};

module.exports = getRequestTemplate;