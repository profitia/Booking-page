import { useState } from 'react';
import type { Slot } from '../types';

interface Props {
  selectedSlot: Slot | null;
  onBook: (data: { fullName: string; email: string; phone: string }) => Promise<void>;
  submitting: boolean;
}

const MONTHS_PL = [
  '', 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

const DAYS_FULL_PL = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

function formatSlotLabel(slot: Slot): string {
  const [year, month, day] = slot.date.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayName = DAYS_FULL_PL[date.getDay()];
  return `${dayName}, ${day} ${MONTHS_PL[month]} · ${slot.startTime}–${slot.endTime}`;
}

export default function BookingForm({ selectedSlot, onBook, submitting }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rodo, setRodo] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!selectedSlot) errs.slot = 'Wybierz termin powyżej.';
    if (!fullName.trim()) errs.fullName = 'Imię i nazwisko jest wymagane.';
    if (!email.trim()) {
      errs.email = 'Adres email jest wymagany.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Podaj prawidłowy adres email.';
    }
    if (!phone.trim()) {
      errs.phone = 'Numer telefonu jest wymagany.';
    } else if (!/^[\+]?[\d\s\-()]{9,15}$/.test(phone)) {
      errs.phone = 'Podaj prawidłowy numer telefonu.';
    }
    if (!rodo) errs.rodo = 'Zgoda na przetwarzanie danych jest wymagana.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      await onBook({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Coś poszło nie tak. Spróbuj ponownie.');
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Sticky summary */}
      {selectedSlot && (
        <div className="sticky top-4 z-10 mb-6">
          <div className="bg-blue-700 text-white rounded-2xl px-5 py-3.5 shadow-lg flex items-center gap-3">
            <svg className="w-4 h-4 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-xs font-semibold opacity-70 uppercase tracking-wider mb-0.5">Wybrany termin</p>
              <p className="text-sm font-semibold">{formatSlotLabel(selectedSlot)}</p>
            </div>
          </div>
        </div>
      )}

      {errors.slot && (
        <p className="text-amber-600 text-sm mb-4 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {errors.slot}
        </p>
      )}

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Imię i nazwisko */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Imię i nazwisko
            </label>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jan Kowalski"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Adres email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan.kowalski@firma.pl"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Numer telefonu
            </label>
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+48 600 000 000"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>
            )}
          </div>

          {/* RODO */}
          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={rodo}
                onChange={(e) => setRodo(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
              />
              <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                Wyrażam zgodę na przetwarzanie moich danych osobowych na potrzeby organizacji badania
                przez Profitia Management Consultants Mazurowski i Wspólnicy Sp. J., 02-715 Warszawa,
                Villa Metro, ul. Puławska 145, V p.
              </span>
            </label>
            {errors.rodo && (
              <p className="text-red-500 text-xs mt-1.5 ml-7">{errors.rodo}</p>
            )}
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.99]"
          >
            {submitting ? 'Rezerwuję...' : 'Zarezerwuj termin'}
          </button>
        </form>
      </div>
    </div>
  );
}
