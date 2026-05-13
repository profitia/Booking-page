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

function formatSlot(slot: Slot): string {
  const [year, month, day] = slot.date.split('-').map(Number);
  return `${day} ${MONTHS_PL[month]} ${year}, ${slot.startTime}–${slot.endTime}`;
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {selectedSlot && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
          <p className="text-sm text-blue-800">
            Wybrany termin: <strong>{formatSlot(selectedSlot)}</strong>
          </p>
        </div>
      )}

      {errors.slot && (
        <p className="text-amber-600 text-sm -mt-2">{errors.slot}</p>
      )}

      {/* Imię i nazwisko */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imię i nazwisko
        </label>
        <input
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jan Kowalski"
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adres email
        </label>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jan.kowalski@firma.pl"
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Telefon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numer telefonu
        </label>
        <input
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+48 600 000 000"
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* RODO */}
      <div className="pt-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={rodo}
            onChange={(e) => setRodo(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            Wyrażam zgodę na przetwarzanie moich danych osobowych na potrzeby organizacji badania
            przez Profitia Management Consultants Mazurowski i Wspólnicy Sp. J., 02-715 Warszawa,
            Villa Metro, ul. Puławska 145, V p.
          </span>
        </label>
        {errors.rodo && (
          <p className="text-red-500 text-xs mt-1 ml-7">{errors.rodo}</p>
        )}
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-6 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitting ? 'Rezerwuję...' : 'Zarezerwuj termin'}
        </button>
      </div>
    </form>
  );
}
