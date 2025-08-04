import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  // Use the site URL from environment variables for the confirmation link
  const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?token=${token}`;
  
  await resend.emails.send({
    from: 'CleanCSV <no-reply@cleancsv.pro>', // Update the sender email to a domain you own
    to: email,
    subject: 'Verify your email address for CleanCSV',
    html: `
      <h1>Welcome to CleanCSV 🎉</h1>
      <p>Click the button below to confirm your email address:</p>
      <a href="${confirmationUrl}" style="padding: 10px 20px; background: #FF5733; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Email</a>
      <p>If you didn’t request this, please ignore.</p>
    `
  });
}
