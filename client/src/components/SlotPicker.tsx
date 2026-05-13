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

const MONTHS_SHORT_PL = [
  '', 'STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE',
  'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU',
];

const DAYS_PL = ['NIEDZ.', 'PON.', 'WT.', 'ŚR.', 'CZW.', 'PT.', 'SOB.'];

function parseDateParts(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return { year, month, day, dayOfWeek: date.getDay() };
}

export default function SlotPicker({ slots, selectedSlot, onSelect }: Props) {
  const availableCount = slots.filter((s) => !s.isReserved).length;

  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  if (dates.length === 0) {
    return <p className="text-gray-400 text-sm mb-8">Brak dostępnych terminów.</p>;
  }

  return (
    <div className="mb-10">
      {/* Licznik */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${
            availableCount > 0
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              availableCount > 0 ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          {availableCount > 0
            ? `Pozostało ${availableCount} dostępnych terminów`
            : 'Brak dostępnych terminów'}
        </span>
      </div>

      {/* Grid kart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map((date, idx) => {
          const { month, day, dayOfWeek } = parseDateParts(date);
          const daySlots = grouped[date];
          const hasAvailable = daySlots.some((s) => !s.isReserved);

          return (
            <div
              key={date}
              className={`rounded-2xl border bg-white p-4 transition-all duration-200 animate-fadeIn ${
                hasAvailable
                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  : 'border-gray-100 opacity-60'
              }`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Nagłówek karty */}
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                  {DAYS_PL[dayOfWeek]}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {day} {MONTHS_SHORT_PL[month]}
                </p>
              </div>

              {/* Sloty */}
              <div className="space-y-2">
                {daySlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.isReserved}
                      onClick={() => onSelect(slot)}
                      className={[
                        'w-full rounded-xl px-3 py-2.5 text-sm font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                        slot.isReserved
                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-700 text-white border-blue-700 shadow-sm scale-[1.02]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-700 hover:scale-[1.02] active:scale-100',
                      ].join(' ')}
                    >
                      {slot.isReserved ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                          {slot.startTime}–{slot.endTime}
                          <span className="text-xs font-normal text-gray-300 ml-1">zajęty</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {slot.startTime}–{slot.endTime}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

