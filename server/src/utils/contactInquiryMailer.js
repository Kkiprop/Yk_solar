import nodemailer from 'nodemailer';

const getMailerConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.ADMIN_EMAIL;
  const to = process.env.CONTACT_NOTIFICATION_TO || process.env.ADMIN_EMAIL;

  if (!host || !user || !pass || !from || !to) {
    return null;
  }

  return {
    transport: {
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    },
    from,
    to,
  };
};

export const sendContactInquiryNotification = async (inquiry) => {
  const config = getMailerConfig();

  if (!config) {
    return { sent: false, skipped: true };
  }

  const transporter = nodemailer.createTransport(config.transport);

  await transporter.sendMail({
    from: config.from,
    to: config.to,
    subject: `New contact inquiry from ${inquiry.name}`,
    text: [
      'A new contact inquiry was submitted on the website.',
      '',
      `Name: ${inquiry.name}`,
      `Phone: ${inquiry.phone}`,
      `Email: ${inquiry.email}`,
      `System size: ${inquiry.systemSize || 'Not specified'}`,
      `Location: ${inquiry.location || 'Not specified'}`,
      `Status: ${inquiry.status}`,
      '',
      'Message:',
      inquiry.message,
    ].join('\n'),
  });

  return { sent: true, skipped: false };
};