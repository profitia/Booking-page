import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendAdminNotification } from '../lib/mailer.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/slots', async (_req, res) => {
  try {
    const slots = await prisma.slot.findMany({
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nie udało się pobrać terminów.' });
  }
});

router.post('/book', async (req, res) => {
  const { slotId, fullName, email, phone } = req.body as {
    slotId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };

  if (!slotId || !fullName || !email || !phone) {
    res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Nieprawidłowy adres email.' });
    return;
  }

  try {
    let slot: { id: string; date: string; startTime: string; endTime: string; isReserved: boolean; createdAt: Date } | null = null;

    await prisma.$transaction(async (tx) => {
      const updated = await tx.slot.updateMany({
        where: { id: slotId, isReserved: false },
        data: { isReserved: true },
      });

      if (updated.count === 0) {
        throw new Error('SLOT_UNAVAILABLE');
      }

      await tx.booking.create({
        data: { slotId, fullName, email, phone },
      });

      slot = await tx.slot.findUnique({ where: { id: slotId } });
    });

    if (slot) {
      sendAdminNotification({ fullName, email, phone, slot }).catch(console.error);
    }

    res.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'SLOT_UNAVAILABLE') {
      res.status(409).json({ error: 'Ten termin jest już zajęty.' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Rezerwacja nie powiodła się. Spróbuj ponownie.' });
  }
});

export default router;
