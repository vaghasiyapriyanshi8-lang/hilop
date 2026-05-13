import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendResetEmail = async (recipient: string, token: string) => {
  await transporter.sendMail({
    from: 'Hilop <no-reply@hilop.com>',
    to: recipient,
    subject: 'Hilop password reset',
    html: `<p>Use this link to reset your password:</p><p><a href="${config.frontendUrl}/reset-password?token=${token}">Reset password</a></p>`,
  });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: 'Hilop <no-reply@hilop.com>',
    to,
    subject,
    html,
  });
};
