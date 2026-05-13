import nodemailer from 'nodemailer';

interface SlotInfo {
  date: string;
  startTime: string;
  endTime: string;
}

interface NotificationData {
  fullName: string;
  email: string;
  phone: string;
  slot: SlotInfo;
}

const MONTHS_PL = [
  '', 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  return `${day} ${MONTHS_PL[month]} 2026`;
}

export async function sendAdminNotification(data: NotificationData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('[mailer] ADMIN_EMAIL not set — skipping notification');
    return;
  }
  if (!process.env.SMTP_HOST) {
    console.warn('[mailer] SMTP_HOST not set — skipping notification');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.error('[mailer] SMTP connection verification failed:', err);
    throw err;
  }

  const dateFormatted = formatDate(data.slot.date);

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: adminEmail,
    subject: 'Nowa rezerwacja badania IDI',
    text: [
      'Pojawiła się nowa rezerwacja.',
      '',
      `Imię i nazwisko: ${data.fullName}`,
      `Email: ${data.email}`,
      `Telefon: ${data.phone}`,
      `Termin: ${dateFormatted} ${data.slot.startTime}-${data.slot.endTime}`,
    ].join('\n'),
  });

  console.log('[mailer] Notification sent, messageId:', info.messageId);
}
