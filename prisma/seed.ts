import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slotTimes = [
  { startTime: '16:00', endTime: '17:30' },
  { startTime: '18:00', endTime: '19:30' },
];

async function main() {
  console.log('Seeding slots: 14–31 maja 2026...');

  const data: { date: string; startTime: string; endTime: string }[] = [];
  const start = new Date('2026-05-14');
  const end = new Date('2026-05-31');
  const current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    for (const t of slotTimes) {
      data.push({ date: dateStr, ...t });
    }
    current.setDate(current.getDate() + 1);
  }

  const result = await prisma.slot.createMany({ data, skipDuplicates: true });
  console.log(`Utworzono ${result.count} slotów.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
