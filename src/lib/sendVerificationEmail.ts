import { Resend } from 'resend';
import Handlebars from 'handlebars';
import template from '../../templates/emailTemplate.hbs';

const resend = new Resend(process.env.RESEND_API_KEY);

const compiledTemplate = Handlebars.compile(template);

export async function sendVerificationEmail(email: string, token: string) {
  // Use the site URL from environment variables for the confirmation link
  const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?token=${token}`;
  
  await resend.emails.send({
    from: 'CleanCSV <no-reply@cleancsv.pro>', // Update the sender email to a domain you own
    to: [email],
    subject: 'Verify your email address for CleanCSV',
    html: compiledTemplate({ confirmationUrl }),
  });
}
