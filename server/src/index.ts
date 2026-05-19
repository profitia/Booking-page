import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import slotsRouter from './routes/slots.js';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', slotsRouter);

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

async function ensureSlots() {
  // Clear and re-seed whenever date range changes
  const RANGE_START = '2026-05-25';
  const RANGE_END   = '2026-06-05';

  const first = await prisma.slot.findFirst({ orderBy: { date: 'asc' } });
  const last  = await prisma.slot.findFirst({ orderBy: { date: 'desc' } });

  const needsReset =
    !first ||
    first.date !== RANGE_START ||
    !last ||
    last.date > RANGE_END ||
    last.date < RANGE_END.slice(0, 7); // rough check

  if (needsReset) {
    // Only delete slots with no booking (avoid FK constraint violation)
    await prisma.slot.deleteMany({ where: { booking: { is: null } } });
    console.log('Slots without bookings removed — re-seeding for new date range.');
  } else {
    return;
  }

  const slotTimes = [
    { startTime: '16:00', endTime: '17:30' },
    { startTime: '18:00', endTime: '19:30' },
  ];

  const data: { date: string; startTime: string; endTime: string }[] = [];
  const start = new Date('2026-05-25');
  const end = new Date('2026-06-05');
  const SKIP_DATES = new Set(['2026-06-04']); // Zielone Świątki
  const current = new Date(start);

  while (current <= end) {
    const day = current.getUTCDay(); // 0=Sun, 6=Sat
    const dateStr = current.toISOString().split('T')[0];
    if (day !== 0 && day !== 6 && !SKIP_DATES.has(dateStr)) {
      for (const t of slotTimes) {
        data.push({ date: dateStr, ...t });
      }
    }
    current.setDate(current.getDate() + 1);
  }

  await prisma.slot.createMany({ data, skipDuplicates: true });
  console.log(`Auto-seeded ${data.length} slots.`);
}

async function main() {
  await ensureSlots();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch(console.error);
