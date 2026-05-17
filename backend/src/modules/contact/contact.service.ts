import { sendEmail } from '../../utils/email';

export class ContactService {
  static async sendContactMessage(payload: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) {
    const { name, email, subject, message } = payload;
    const emailSubject = subject ? `[Hilop Contact] ${subject}` : `[Hilop Contact] New message from ${name}`;

    // Email to support team
    await sendEmail(
      process.env.EMAIL_USERNAME as string,
      emailSubject,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">
              <span style="color: #4ade80;">Hilop</span> — New Contact Message
            </h1>
          </div>
          <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 100px;">Name:</td>
                <td style="padding: 8px 0; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #111827;">${email}</td>
              </tr>
              ${subject ? `<tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subject:</td>
                <td style="padding: 8px 0; color: #111827;">${subject}</td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="font-weight: bold; color: #374151; margin: 0 0 8px;">Message:</p>
              <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${email}" style="background: #4ade80; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Reply to ${name}
              </a>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} Hilop. All rights reserved.
          </div>
        </div>
      `
    );

    // Auto-reply to the user
    await sendEmail(
      email,
      'We received your message — Hilop Support',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; padding: 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">
              <span style="color: #4ade80;">Hilop</span>
            </h1>
          </div>
          <div style="padding: 32px; background: #f9fafb; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin: 0 0 16px;">Hi ${name},</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for reaching out to us. We've received your message and our team will get back to you within <strong>24 hours</strong>.
            </p>
            <div style="margin: 24px 0; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #e5e7eb;">
              <p style="font-weight: bold; color: #374151; margin: 0 0 8px;">Your message:</p>
              <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              In the meantime, you can browse our collection or check our FAQ.
            </p>
            <div style="margin-top: 24px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}" style="background: #4ade80; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Visit Hilop
              </a>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} Hilop. All rights reserved. · support@hilop.com
          </div>
        </div>
      `
    );
  }
}
