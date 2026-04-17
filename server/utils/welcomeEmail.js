const welcomeTemplate = (name, role) => {
  const isOwner = role === 'owner';

  const buttonLink = isOwner
    ? `${process.env.CLIENT_URI}/property-owner/dashboard`
    : `${process.env.CLIENT_URI}/tenant/dashboard`;

  const buttonText = isOwner
    ? "List Your Property →"
    : "Explore Properties →";

  const description = isOwner
    ? "Start listing your property and connect with thousands of tenants across Nepal."
    : "Browse verified rooms and apartments across Nepal and find your perfect home.";

  const features = isOwner
    ? `
      <li>🏠 List properties </li>
      <li>📞 Connect with tenants directly</li>
      <li>💰 Earn from your property</li>
    `
    : `
      <li>🔍 Browse verified listings</li>
      <li>📞 Contact owners directly</li>
      <li>🔒 Safe & secure booking</li>
    `;

  return `
  <div style="font-family: 'Segoe UI', sans-serif; background: #f4f6fb; padding: 30px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ff4bb4, #a238ff); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">
          🏡 RentEase
        </h1>
        <p style="color: #ffe3f7; margin-top: 8px; font-size: 14px;">
          Find Your Perfect Rental in Nepal
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 35px 30px; color: #333;">
        
        <h2 style="margin-top: 0; color: #1a1a1a;">
          Namaste ${name} 👋
        </h2>

        <p style="font-size: 16px; color: #555;">
          Welcome to <b>RentEase</b>! ${description}
        </p>

        <!-- Features -->
        <div style="margin: 25px 0;">
          <ul style="padding-left: 20px; line-height: 1.8; color: #444;">
            ${features}
          </ul>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${buttonLink}" 
             style="
               background: linear-gradient(135deg, #ff4bb4, #a238ff);
               color: white;
               padding: 14px 32px;
               text-decoration: none;
               border-radius: 50px;
               font-weight: 600;
               font-size: 15px;
               display: inline-block;
               box-shadow: 0 6px 20px rgba(162,56,255,0.3);
             ">
             ${buttonText}
          </a>
        </div>

        <p style="font-size: 14px; color: #777;">
          Need help? Just reply to this email — we’re here for you 💜
        </p>

      </div>

      <!-- Footer -->
      <div style="background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="margin: 0; font-size: 12px; color: #999;">
          © 2026 RentEase Nepal 🇳🇵
        </p>
        <p style="margin: 5px 0 0; font-size: 11px; color: #bbb;">
         Dang, Nepal
        </p>
      </div>

    </div>
  </div>
  `;
};

 module.exports = {welcomeTemplate}