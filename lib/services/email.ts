import { google } from 'googleapis';
import { logger } from '@/lib/logger';

let gmailClient: ReturnType<typeof google.gmail> | null = null;

function getGmailClient() {
  if (gmailClient) return gmailClient;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    logger.warn('Google OAuth not configured for Gmail — skipping email send');
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  gmailClient = google.gmail({ version: 'v1', auth: oauth2Client });
  return gmailClient;
}

const FROM_EMAIL = 'DroneWire <alfred.intel.handler@gmail.com>';
const SITE_URL = process.env.SITE_URL || 'https://dronewire.org';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Build a RFC 2822 compliant raw email message.
 * Gmail API requires base64url-encoded raw MIME messages.
 */
function buildRawEmail(to: string, subject: string, html: string, text?: string): string {
  const recipients = Array.isArray(to) ? to.join(', ') : to;
  const boundary = `dronewire_${Date.now()}`;

  const headers = [
    `From: ${FROM_EMAIL}`,
    `To: ${recipients}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
  ].join('\r\n');

  // Plain text fallback
  const plainBody = text || html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

  const body = [
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    plainBody,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    html,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  const raw = headers + body;
  return Buffer.from(raw).toString('base64url');
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const gmail = getGmailClient();

  if (!gmail) {
    return { success: false, error: 'Gmail API not configured' };
  }

  try {
    const recipients = Array.isArray(to) ? to.join(', ') : to;
    const raw = buildRawEmail(recipients, subject, html, text);

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw },
    });

    return { success: true, data: { messageId: response.data.id } };
  } catch (error: any) {
    logger.error('Gmail send error:', error?.message || error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
}

// ── Templates ─────────────────────────────────────────────────────────

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
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">DroneWire</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Counter-UAS Intelligence Hub</p>
    </div>

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
        <li><strong>Weekly Intelligence Digest</strong> — Curated news and analysis</li>
        <li><strong>Contract Alerts</strong> — Latest defense contract awards</li>
        <li><strong>Technology Deep Dives</strong> — Explainers on emerging systems</li>
        <li><strong>Breaking News</strong> — Critical developments as they happen</li>
      </ul>

      <a href="${SITE_URL}/articles" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
        Explore Latest Articles
      </a>
    </div>

    <div style="background-color: #f4f4f5; padding: 24px 32px; text-align: center;">
      <p style="color: #71717a; font-size: 12px; margin: 0;">
        You're receiving this email because you subscribed to DroneWire.<br>
        <a href="${SITE_URL}/unsubscribe" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getContactNotificationHtml(data: {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  type: string;
}) {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeCompany = data.company ? escapeHtml(data.company) : '';
  const safeSubject = escapeHtml(data.subject);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');
  const safeType = escapeHtml(data.type);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">New Contact Form Submission</h1>
    </div>

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
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendWelcomeEmail(email: string, firstName?: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to DroneWire — Your Counter-UAS Intelligence Source',
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
  const adminEmail = process.env.ADMIN_EMAIL || 'jdelvo06@gmail.com';
  return sendEmail({
    to: adminEmail,
    subject: `[DroneWire Contact] ${data.type}: ${data.subject}`,
    html: getContactNotificationHtml(data),
  });
}
