/**
 * utils/sendEmail.js - Email Utility using Nodemailer
 * Sends password reset emails with the reset link.
 */

const nodemailer = require('nodemailer');

/**
 * Sends a password reset email to the user.
 * @param {string} toEmail - Recipient email address
 * @param {string} resetLink - Full URL with the reset token
 * @param {string} userName - Recipient's name for personalization
 */
const sendResetEmail = async (toEmail, resetLink, userName) => {
  // Create Nodemailer transporter using SMTP settings from .env
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Calculate expiry time for display in email (default 1 hour)
  const expiryMinutes = Math.floor(
    (parseInt(process.env.RESET_TOKEN_EXPIRY, 10) || 3600000) / 60000
  );

  // Email message configuration
  const mailOptions = {
    from: `"SecureApp Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Password Reset Request - SecureApp',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Password Reset</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: #e94560; margin: 0; font-size: 28px; letter-spacing: 2px; }
          .header p { color: #a8b2d8; margin: 8px 0 0; font-size: 14px; }
          .body { padding: 40px 30px; }
          .body h2 { color: #1a1a2e; font-size: 22px; margin-bottom: 16px; }
          .body p { color: #555; line-height: 1.7; font-size: 15px; }
          .btn { display: inline-block; margin: 24px 0; padding: 14px 36px; background: linear-gradient(135deg, #e94560, #c1121f); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.5px; }
          .warning { background: #fff8e1; border-left: 4px solid #ffc107; padding: 14px 18px; border-radius: 4px; margin: 20px 0; color: #7a5c00; font-size: 14px; }
          .link-box { background: #f4f6f9; border: 1px dashed #ccc; border-radius: 6px; padding: 12px; word-break: break-all; font-size: 12px; color: #555; margin: 16px 0; }
          .footer { background: #f4f6f9; padding: 20px 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 SECUREAPP</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="body">
            <h2>Hello, ${userName}!</h2>
            <p>We received a request to reset the password for your SecureApp account. Click the button below to set a new password:</p>
            <a href="${resetLink}" class="btn">Reset My Password</a>
            <div class="warning">
              ⚠️ <strong>This link expires in ${expiryMinutes} minutes.</strong> If you did not request a password reset, please ignore this email — your password will not change.
            </div>
            <p>If the button above doesn't work, copy and paste the link below into your browser:</p>
            <div class="link-box">${resetLink}</div>
          </div>
          <div class="footer">
            <p>© 2024 SecureApp. This is an automated email — please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Reset email sent to ${toEmail}: ${info.messageId}`);
  return info;
};

module.exports = { sendResetEmail };
