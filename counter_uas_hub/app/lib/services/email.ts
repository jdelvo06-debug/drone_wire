import { Resend } from 'resend';
import { logger } from '@/lib/logger';

let resend: Resend | null = null;

function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'DroneWire <noreply@dronewire.com>';

/**
 * Escape HTML special characters to prevent XSS attacks
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const client = getResendClient();

  if (!client) {
    logger.warn('RESEND_API_KEY not configured, skipping email send');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      logger.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Email templates
export function getWelcomeEmailHtml(firstName?: string) {
  const name = firstName || 'there';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">DroneWire</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Counter-UAS Intelligence Hub</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <h2 style="color: #18181b; margin: 0 0 16px; font-size: 24px;">Welcome to DroneWire, ${name}!</h2>

      <p style="color: #3f3f46; line-height: 1.6; margin: 0 0 16px;">
        Thank you for subscribing to our newsletter. You're now part of a community of defense professionals,
        analysts, and enthusiasts staying ahead of the rapidly evolving counter-UAS landscape.
      </p>

      <p style="color: #3f3f46; line-height: 1.6; margin: 0 0 24px;">
        Here's what you can expect:
      </p>

      <ul style="color: #3f3f46; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
        <li><strong>Weekly Intelligence Digest</strong> - Curated news and analysis</li>
        <li><strong>Contract Alerts</strong> - Latest defense contract awards</li>
        <li><strong>Technology Deep Dives</strong> - Explainers on emerging systems</li>
        <li><strong>Breaking News</strong> - Critical developments as they happen</li>
      </ul>

      <a href="https://dronewire.com/articles" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Explore Latest Articles
      </a>
    </div>

    <!-- Footer -->
    <div style="background-color: #f4f4f5; padding: 24px 32px; text-align: center;">
      <p style="color: #71717a; font-size: 12px; margin: 0;">
        You're receiving this email because you subscribed to DroneWire.<br>
        <a href="https://dronewire.com/unsubscribe" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getContactNotificationHtml(data: {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  type: string;
}) {
  // Escape all user-provided data to prevent XSS
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeCompany = data.company ? escapeHtml(data.company) : '';
  const safeSubject = escapeHtml(data.subject);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');
  const safeType = escapeHtml(data.type);

  // URL-encode email and subject for mailto link
  const encodedSubject = encodeURIComponent(`Re: ${data.subject}`);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New Contact Form Submission</h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a; width: 120px;">Name:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #18181b; font-weight: 500;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a;">Email:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #18181b;"><a href="mailto:${safeEmail}" style="color: #3b82f6;">${safeEmail}</a></td>
        </tr>
        ${safeCompany ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a;">Company:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #18181b;">${safeCompany}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a;">Type:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #18181b;">${safeType}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #71717a;">Subject:</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #18181b; font-weight: 500;">${safeSubject}</td>
        </tr>
      </table>

      <div style="margin-top: 24px;">
        <p style="color: #71717a; margin: 0 0 8px; font-size: 14px;">Message:</p>
        <div style="background-color: #f4f4f5; padding: 16px; border-radius: 6px; color: #3f3f46; line-height: 1.6;">
          ${safeMessage}
        </div>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${safeEmail}?subject=${encodedSubject}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Reply to ${safeName}
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendWelcomeEmail(email: string, firstName?: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to DroneWire - Your Counter-UAS Intelligence Source',
    html: getWelcomeEmailHtml(firstName),
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  type: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dronewire.com';
  return sendEmail({
    to: adminEmail,
    subject: `[DroneWire Contact] ${data.type}: ${data.subject}`,
    html: getContactNotificationHtml(data),
  });
}
