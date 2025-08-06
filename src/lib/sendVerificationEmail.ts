import { Resend } from 'resend';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  // Read and compile the template inside the function
  const templatePath = path.join(process.cwd(), 'templates', 'emailTemplate.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = Handlebars.compile(templateSource);
  
  // Use the site URL from environment variables for the confirmation link
  const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?token=${token}`;
  
  await resend.emails.send({
    from: 'CleanCSV <no-reply@cleancsv.pro>', // Update the sender email to a domain you own
    to: [email],
    subject: 'Verify your email address for CleanCSV',
    html: compiledTemplate({ confirmationUrl }),
  });
}
