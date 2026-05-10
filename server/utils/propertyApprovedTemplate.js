const propertyApprovedTemplate = (ownerName, propertyTitle) => {
  const dashboardLink = `${process.env.CLIENT_URI}/owner/dashboard`;

  return `
  <div style="font-family: 'Segoe UI', sans-serif; background: #fef9c3; padding: 30px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(161, 98, 7, 0.1);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #facc15, #a16207); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">
          🏠 RentEase Approved
        </h1>
        <p style="color: #fef9c3; margin-top: 8px; font-size: 14px;">
          Your Property is Now Live!
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 35px 30px; color: #333;">
        
        <h2 style="margin-top: 0; color: #a16207;">
          Great News, ${ownerName}! 🎉
        </h2>

        <p style="font-size: 16px; color: #555; line-height: 1.6;">
          Your property <b>"${propertyTitle}"</b> has been reviewed and <b>approved</b> by our admin team.
        </p>

        <div style="background: #fffbeb; border-left: 4px solid #facc15; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; color: #a16207; font-weight: 600;">
            Status: ✅ Available & Live
          </p>
          <p style="margin: 5px 0 0; font-size: 14px; color: #713f12;">
            Tenants can now find and book your property through the RentEase platform.
          </p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${dashboardLink}" 
             style="
               background: linear-gradient(135deg, #a08a33, #a16207);
               color: white;
               padding: 14px 32px;
               text-decoration: none;
               border-radius: 50px;
               font-weight: 600;
               font-size: 15px;
               display: inline-block;
               box-shadow: 0 6px 20px rgba(161, 98, 7, 0.2);
             ">
             View Your Listing →
          </a>
        </div>

        <p style="font-size: 14px; color: #777;">
          Make sure your contact details are up to date to ensure smooth communication with tenants.
        </p>

      </div>

      <!-- Footer -->
      <div style="background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="margin: 0; font-size: 12px; color: #999;">
          © 2026 RentEase Nepal 🇳🇵
        </p>
        <p style="margin: 5px 0 0; font-size: 11px; color: #bbb;">
          Keeping your rentals safe and easy.
        </p>
      </div>

    </div>
  </div>
  `;
};

module.exports =  propertyApprovedTemplate 