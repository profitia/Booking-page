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
  if (!adminEmail || !process.env.SMTP_HOST) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const dateFormatted = formatDate(data.slot.date);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
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
}
