import type { Slot } from '../types';

interface Props {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSelect: (slot: Slot) => void;
}

const MONTHS_PL = [
  '', 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

const DAYS_PL = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayName = DAYS_PL[date.getDay()];
  return `${dayName} ${day} ${MONTHS_PL[month]}`;
}

export default function SlotPicker({ slots, selectedSlot, onSelect }: Props) {
  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  if (dates.length === 0) {
    return (
      <p className="text-gray-500 text-sm mb-8">Brak dostępnych terminów.</p>
    );
  }

  return (
    <div className="mb-10 space-y-5">
      {dates.map((date) => (
        <div key={date}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {formatDate(date)}
          </p>
          <div className="flex gap-3 flex-wrap">
            {grouped[date].map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={slot.isReserved}
                  onClick={() => onSelect(slot)}
                  className={[
                    'px-4 py-2 rounded-lg border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                    slot.isReserved
                      ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-700',
                  ].join(' ')}
                >
                  {slot.startTime} – {slot.endTime}
                  {slot.isReserved && (
                    <span className="ml-2 text-xs font-normal">zajęty</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
