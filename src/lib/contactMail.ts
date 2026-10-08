import nodemailer from 'nodemailer';

export const CONTACT_ACKNOWLEDGEMENT =
  'We have received your question and will respond shortly.';

const EMAIL_FROM =
  process.env.EMAIL_FROM || 'Funkcamp 2027 <no-reply@funkcamp.example.com>';
const ADMIN_EMAIL = process.env.FUNKCAMP_ADMIN_EMAIL || 'funkcampswe@gmail.com';
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

type ContactMailData = {
  fullName: string;
  email: string;
  message: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

export async function sendFunkcampContactQuestion({
  fullName,
  email,
  message,
}: ContactMailData) {
  if (!transporter) {
    throw new Error('Email service is not configured.');
  }

  const escapedName = escapeHtml(fullName);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: 'New Funkcamp 2027 question',
    text: `New Funkcamp 2027 question\n\nName: ${fullName}\nEmail: ${email}\n\nQuestion:\n${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h1 style="color:#e2141f;">New Funkcamp 2027 question</h1>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapedEmail}">${escapedEmail}</a></p>
        <h2>Question</h2>
        <p>${escapedMessage}</p>
      </div>
    `,
  });

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      replyTo: ADMIN_EMAIL,
      subject: 'Funkcamp 2027 — We have received your question',
      text: CONTACT_ACKNOWLEDGEMENT,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <p>${CONTACT_ACKNOWLEDGEMENT}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Funkcamp question received, but acknowledgement email failed:', error);
  }
}
