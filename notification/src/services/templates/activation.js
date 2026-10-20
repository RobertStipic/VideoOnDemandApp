export const activationTemplate = ({ firstName, activationUrl }) => {
  return `
    <h2>Welcome to VodApp!</h2>
    <p>Hi ${firstName || "there"},</p>
    <p>Thank you for signing up. Click the link below to activate your account:</p>
    <p>
      <a href="${activationUrl}" style="background:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Activate Account
      </a>
    </p>
    <p>This link expires in 24 hours.</p>
    <p>If you didn't sign up, ignore this email.</p>
    <p>— VodApp Team</p>
  `;
};
