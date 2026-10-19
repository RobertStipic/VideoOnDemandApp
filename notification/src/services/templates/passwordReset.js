export const passwordResetTemplate = ({ firstName, resetUrl }) => {
  return `
    <h2>Password Reset</h2>
    <p>Hi ${firstName || "there"},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p>
      <a href="${resetUrl}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Reset Password
      </a>
    </p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, ignore this email.</p>
    <p>VodApp Team</p>
  `;
};
