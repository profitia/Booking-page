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

// In-memory refresh token — seeded from env var, updated on each successful exchange
let currentRefreshToken = '';

function getRefreshToken(): string {
  if (!currentRefreshToken) {
    // Strip any whitespace/newlines that may have been introduced during copy-paste
    currentRefreshToken = (process.env.AZURE_REFRESH_TOKEN ?? '').replace(/\s+/g, '');
  }
  return currentRefreshToken;
}

async function getGraphToken(): Promise<string> {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const refreshToken = getRefreshToken();

  if (!tenantId || !clientId || !refreshToken) {
    throw new Error('[mailer] Missing AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_REFRESH_TOKEN');
  }

  // PublicClientApplication flow — no client_secret in token request
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
    scope: 'https://graph.microsoft.com/Mail.Send offline_access',
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    }
  );

  const data = await res.json() as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(`[mailer] Token exchange failed: ${data.error_description ?? data.error ?? JSON.stringify(data)}`);
  }

  // Rotate in-memory refresh token if a new one was issued
  if (data.refresh_token) {
    currentRefreshToken = data.refresh_token;
  }

  return data.access_token;
}

export async function sendAdminNotification(data: NotificationData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailFrom = process.env.MAIL_FROM;

  if (!adminEmail) {
    console.warn('[mailer] ADMIN_EMAIL not set — skipping notification');
    return;
  }
  if (!mailFrom) {
    console.warn('[mailer] MAIL_FROM not set — skipping notification');
    return;
  }

  const token = await getGraphToken();
  const dateFormatted = formatDate(data.slot.date);

  const body = [
    'Pojawiła się nowa rezerwacja.',
    '',
    `Imię i nazwisko: ${data.fullName}`,
    `Email: ${data.email}`,
    `Telefon: ${data.phone}`,
    `Termin: ${dateFormatted} ${data.slot.startTime}–${data.slot.endTime}`,
  ].join('\n');

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/sendMail`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          subject: 'Nowa rezerwacja badania IDI',
          body: { contentType: 'Text', content: body },
          toRecipients: [{ emailAddress: { address: adminEmail } }],
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[mailer] Graph API sendMail failed ${res.status}: ${err}`);
  }

  console.log(`[mailer] Notification sent to ${adminEmail} via Graph API`);
}

