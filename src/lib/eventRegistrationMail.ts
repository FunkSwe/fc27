import nodemailer from 'nodemailer';

const EMAIL_FROM = process.env.EMAIL_FROM || 'Funkcamp 2027 <no-reply@funkcamp.example.com>';
const ADMIN_EMAIL = process.env.FUNKCAMP_ADMIN_EMAIL || 'funkcampswe@gmail.com';

const rawAppUrl =
  process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000';

const APP_URL = rawAppUrl.replace(/\/$/, '');

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

type RegistrationMailData = {
  fullName: string;
  email: string;
  country?: string;
  message?: string;
  hasAttended2025?: boolean;
};

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

export async function sendFunkcampRegistrationConfirmation({
  fullName,
  email,
}: RegistrationMailData) {
  const contactUrl = `${APP_URL}/contact`;

  const subject = 'Funkcamp 2027 Registration';

  const text = `
Hi ${fullName},

Thank you for registering for Funkcamp 2027.

We are happy to know that you want to be part of the next Funkcamp experience in Stockholm, Sweden.

Price: €250
If you are in Sweden: 2700 kr

To secure your spot, a booking fee of €100 must be paid as soon as possible.

Please note: your spot is only secured once the booking fee has been paid. If the camp starts to fill up and the booking fee has not been paid, the spot may be released.

After the booking fee is paid, your spot is secured and you will keep the price of €250 / 2700 kr.

The remaining amount must be paid no later than December 31st, 2026.

The teachers will be introduced on the website during the coming months.

Funkcamp 2027 will take place March 26th–29th, 2027.

Times and venue will be announced later this year, but the schedule will be similar to 2025:

Friday: 17.30–20.30
Saturday: 11.00–17.00
Sunday: 11.00–17.00
Monday: 10.00–14.00

There might be extra events coming up, and we will let you know during the process leading up to 2027.

Once the booking fee has been paid, we will send you the sign-up/payment page link and continue the registration process with you.

We are looking forward to having you here in Stockholm, Sweden once again for this beautiful experience.

If you have any questions, please reach out:
${contactUrl}

Best regards,
Team Funkcamp
funkcampswe@gmail.com
`.trim();

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 680px;">
    <h1 style="color:#e2141f;">Funkcamp 2027 Registration</h1>

    <p>Hi ${fullName},</p>

    <p>
      Thank you for registering for <strong>Funkcamp 2027</strong>.
    </p>

    <p>
      We are happy to know that you want to be part of the next Funkcamp
      experience in <strong>Stockholm, Sweden</strong>.
    </p>

    <h2 style="color:#e2141f;">Price</h2>

    <p>
      <strong>€250</strong><br />
      If you are in Sweden: <strong>2700 kr</strong>
    </p>

    <p>
      To secure your spot, a booking fee of <strong>€100</strong> must be paid as soon as possible.
    </p>

    <p>
      <strong>Please note:</strong> your spot is only secured once the booking fee has been paid.
      If the camp starts to fill up and the booking fee has not been paid, the spot may be released.
    </p>

    <p>
      After the booking fee is paid, your spot is secured and you will keep the price of
      <strong>€250 / 2700 kr</strong>.
    </p>

    <p>
      The remaining amount must be paid no later than <strong>December 31st, 2026</strong>.
    </p>

    <h2 style="color:#e2141f;">Dates</h2>

    <p>
      Funkcamp 2027 will take place <strong>March 26th–29th, 2027</strong>.
    </p>

    <p>
      Times and venue will be announced later this year, but the schedule will be similar to 2025:
    </p>

    <ul>
      <li>Friday: 17.30–20.30</li>
      <li>Saturday: 11.00–17.00</li>
      <li>Sunday: 11.00–17.00</li>
      <li>Monday: 10.00–14.00</li>
    </ul>

    <p>
      The teachers will be introduced on the website during the coming months.
    </p>

    <p>
      There might be extra events coming up, and we will let you know during the process leading up to 2027.
    </p>

    <p>
      Once the booking fee has been paid, we will send you the sign-up/payment page link and continue
      the registration process with you.
    </p>

    <p>
      We are looking forward to having you here in Stockholm, Sweden once again for this beautiful experience.
    </p>

    <p>
      If you have any questions, please reach out.
    </p>

    <p>
      <a
        href="${contactUrl}"
        style="display:inline-block;padding:12px 18px;background:#e2141f;color:#ffffff;text-decoration:none;font-weight:bold;"
      >
        Contact Funkcamp
      </a>
    </p>

    <p>
      Best regards,<br />
      Team Funkcamp<br />
      funkcampswe@gmail.com
    </p>
  </div>
`;

  await sendMail({
    to: email,
    subject,
    text,
    html,
    warningMessage: `Registration confirmation email not sent. SMTP not configured. Email: ${email}`,
  });
}

export async function sendFunkcampAdminRegistrationNotice({
  fullName,
  email,
  country,
  message,
  hasAttended2025,
}: RegistrationMailData) {
  const subject = `New Funkcamp 2027 registration: ${fullName}`;

  const text = `
New Funkcamp 2027 registration

Name: ${fullName}
Email: ${email}
Country: ${country || '-'}
Joined Funkcamp 2025: ${hasAttended2025 ? 'Yes' : 'No'}

Message:
${message || '-'}

You can now continue the conversation with this participant.
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h1 style="color:#e2141f;">New Funkcamp 2027 registration</h1>

      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Country:</strong> ${country || '-'}</p>
      <p><strong>Joined Funkcamp 2025:</strong> ${hasAttended2025 ? 'Yes' : 'No'}</p>

      <h2>Message</h2>
      <p>${message ? message.replace(/\n/g, '<br />') : '-'}</p>

      <p>You can now continue the conversation with this participant.</p>
    </div>
  `;

  await sendMail({
    to: ADMIN_EMAIL,
    subject,
    text,
    html,
    warningMessage: `Admin registration notice not sent. SMTP not configured. Registration from: ${email}`,
  });
}