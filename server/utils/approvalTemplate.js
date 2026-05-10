const getApprovalTemplate = (tenantName, propertyTitle, amountPaid) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0ea5e9; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed! 🏠</h1>
      </div>
      
      <div style="padding: 30px; color: #333; line-height: 1.6;">
        <p style="font-size: 18px; margin-top: 0;">Namaste <b>${tenantName}</b>,</p>
        
        <p>Great news! Your booking request for <b>${propertyTitle}</b> has been officially <b>Approved</b> by the owner.</p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #0369a1;">Payment Verified</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">The amount of <b>NPR ${amountPaid.toLocaleString()}</b> has been successfully received and accepted.</p>
        </div>

        <p>You can now start planning your move! Whether it's a cozy room or a spacious villa, it's officially yours to occupy.</p>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="${process.env.CLIENT_URI}/tenant/dashboard" style="background-color: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
        </div>

        <p style="font-size: 14px; color: #666;">If you have any questions regarding keys or moving times, please check the owner's contact details in your RentEase dashboard.</p>
      </div>

      <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; 2026 RentEase Nepal. All rights reserved.</p>
      </div>
    </div>
  `;
};

module.exports = getApprovalTemplate;