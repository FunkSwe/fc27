import nodemailer from 'nodemailer';

const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@funkcamp.example.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';

const smtpHost = process.env.EMAIL_HOST;
const smtpPort = Number(process.env.EMAIL_PORT || '587');
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;

let transporter: any = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export async function sendPasswordResetEmail(email: string, username: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const subject = 'Reset your Funkcamp password';
  const text = `Hi ${username},\n\nWe received a request to reset your Funkcamp password. Use this link to create a new password:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.\n\nThanks,\nFunkcamp Team`;
  const html = `<p>Hi ${username},</p><p>We received a request to reset your Funkcamp password. Use this link to create a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can ignore this email.</p><p>Thanks,<br/>Funkcamp Team</p>`;

  if (!transporter) {
    console.warn('Password reset email not sent. SMTP not configured. Reset link:', resetUrl);
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

export async function sendAccountVerificationEmail(
  email: string,
  username: string,
  token: string
) {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const subject = 'Confirm your Funkcamp account';
  const text = `Hi ${username},\n\nThanks for creating a Funkcamp account. Confirm your email by clicking the link below:\n\n${verifyUrl}\n\nIf you did not create this account, you can ignore this message.\n\nThanks,\nFunkcamp Team`;
  const html = `<p>Hi ${username},</p><p>Thanks for creating a Funkcamp account. Confirm your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>If you did not create this account, you can ignore this message.</p><p>Thanks,<br/>Funkcamp Team</p>`;

  if (!transporter) {
    console.warn('Email verification not sent. SMTP not configured. Verification link:', verifyUrl);
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}
