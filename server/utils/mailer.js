const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
             host: "smtp.gmail.com",
              port: 465,
               secure: true,
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS  
            }
        });

        const mailOptions = {
            from: `"RentEase Nepal 🏠" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email Sent: ${subject}`);
        return info;
    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
      
        return null; 
    }
};

module.exports = sendEmail;