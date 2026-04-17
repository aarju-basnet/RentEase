const otpTemplate = (fullName, otp) => {
  return `
  <div style="margin:0; padding:0; background:#f4f6f8; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 12px 30px rgba(0,0,0,0.1);">
      
      <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding:25px; text-align:center; color:white;">
        <h1 style="margin:0;">🏠 RentEase</h1>
        <p style="margin:5px 0 0;">Find Your Perfect Rental in Nepal</p>
      </div>

      <div style="padding:30px; text-align:center;">
        <h2>Hello ${fullName || "User"}, 👋</h2>
        <p>Use the OTP below to reset your password:</p>

        <div style="margin:30px 0;">
          <span style="background:#f1f5f9; padding:15px 30px; font-size:28px; letter-spacing:8px; font-weight:bold; border-radius:8px;">
            ${otp}
          </span>
        </div>

        <p>This OTP is valid for 10 minutes.</p>

        <a href="${process.env.CLIENT_URI}/verify-otp"
          style="display:inline-block; margin-top:20px; padding:12px 25px; background:linear-gradient(135deg,#ec4899,#7c3aed); color:white; border-radius:6px; text-decoration:none;">
          Verify OTP →
        </a>
      </div>

      <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px;">
        © ${new Date().getFullYear()} RentEase Nepal 🇳🇵
      </div>

    </div>
  </div>
  `;
};

module.exports = {  otpTemplate };