import nodemailer from 'nodemailer';

const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@funkcamp.example.com';
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  'http://localhost:3000';

const smtpHost = process.env.EMAIL_HOST;
const smtpPort = Number(process.env.EMAIL_PORT || '587');
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;

const transporter =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })
    : null;

async function sendMail({
  to,
  subject,
  text,
  html,
  warningMessage,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
  warningMessage: string;
}) {
  if (!transporter) {
    console.warn(warningMessage);
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  username: string,
  token: string,
) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${encodeURIComponent(
    token,
  )}&email=${encodeURIComponent(email)}`;

  const subject = 'Reset your Funkcamp password';

  const text = `
Hi ${username},

We received a request to reset your Funkcamp password.

Use this link to create a new password:
${resetUrl}

If you did not request this, you can ignore this email.

Thanks,
Funkcamp Team
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1 style="color: #e2141f;">Reset your Funkcamp password</h1>

      <p>Hi ${username},</p>

      <p>We received a request to reset your Funkcamp password.</p>

      <p>
        <a
          href="${resetUrl}"
          style="display:inline-block;padding:12px 18px;background:#e2141f;color:#ffffff;text-decoration:none;font-weight:bold;"
        >
          Reset password
        </a>
      </p>

      <p>Or copy and paste this link into your browser:</p>

      <p>
        <a href="${resetUrl}">${resetUrl}</a>
      </p>

      <p>If you did not request this, you can ignore this email.</p>

      <p>Thanks,<br />Funkcamp Team</p>
    </div>
  `;

  await sendMail({
    to: email,
    subject,
    text,
    html,
    warningMessage: `Password reset email not sent. SMTP not configured. Reset link: ${resetUrl}`,
  });
}

export async function sendAccountCreatedEmail(
  email: string,
  username: string,
) {
  const loginUrl = `${APP_URL}/auth/login`;

  const subject = 'Your Funkcamp account has been created';

  const text = `
Hi ${username},

Your Funkcamp account has been created successfully.

You can now log in and access your dashboard:
${loginUrl}

Keep it funky,
Funkcamp Team
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1 style="color: #e2141f;">Welcome to Funkcamp</h1>

      <p>Hi ${username},</p>

      <p>Your Funkcamp account has been created successfully.</p>

      <p>You can now log in and access your dashboard.</p>

      <p>
        <a
          href="${loginUrl}"
          style="display:inline-block;padding:12px 18px;background:#e2141f;color:#ffffff;text-decoration:none;font-weight:bold;"
        >
          Log in
        </a>
      </p>

      <p>Keep it funky,<br />Funkcamp Team</p>
    </div>
  `;

  await sendMail({
    to: email,
    subject,
    text,
    html,
    warningMessage: `Account created email not sent. SMTP not configured. Login link: ${loginUrl}`,
  });
}

export async function sendAccountVerificationEmail(
  email: string,
  username: string,
  token: string,
) {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${encodeURIComponent(
    token,
  )}&email=${encodeURIComponent(email)}`;

  const subject = 'Confirm your Funkcamp account';

  const text = `
Hi ${username},

Thanks for creating a Funkcamp account.

Confirm your email by clicking the link below:
${verifyUrl}

If you did not create this account, you can ignore this message.

Thanks,
Funkcamp Team
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1 style="color: #e2141f;">Confirm your Funkcamp account</h1>

      <p>Hi ${username},</p>

      <p>Thanks for creating a Funkcamp account.</p>

      <p>Confirm your email by clicking the button below:</p>

      <p>
        <a
          href="${verifyUrl}"
          style="display:inline-block;padding:12px 18px;background:#e2141f;color:#ffffff;text-decoration:none;font-weight:bold;"
        >
          Confirm account
        </a>
      </p>

      <p>Or copy and paste this link into your browser:</p>

      <p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      </p>

      <p>If you did not create this account, you can ignore this message.</p>

      <p>Thanks,<br />Funkcamp Team</p>
    </div>
  `;

  await sendMail({
    to: email,
    subject,
    text,
    html,
    warningMessage: `Email verification not sent. SMTP not configured. Verification link: ${verifyUrl}`,
  });
}