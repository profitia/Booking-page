import { useState, useEffect } from 'react';
import type { Slot } from './types';
import Hero from './components/Hero';
import Materials from './components/Materials';
import SlotPicker from './components/SlotPicker';
import BookingForm from './components/BookingForm';
import SuccessScreen from './components/SuccessScreen';

function StepHeading({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex-shrink-0">
        {number}
      </span>
      <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
    </div>
  );
}

export default function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => {
        if (!r.ok) throw new Error('Błąd serwera');
        return r.json();
      })
      .then((data: Slot[]) => {
        setSlots(data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError('Nie udało się pobrać terminów. Odśwież stronę.');
        setLoading(false);
      });
  }, []);

  async function handleBook(formData: { fullName: string; email: string; phone: string }) {
    if (!selectedSlot) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selectedSlot.id, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setSlots((prev) =>
            prev.map((s) => (s.id === selectedSlot.id ? { ...s, isReserved: true } : s))
          );
          setSelectedSlot(null);
        }
        throw new Error(data.error || 'Rezerwacja nie powiodła się.');
      }
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Materials />

      <div className="max-w-3xl mx-auto px-4 pb-24">

        {/* Krok 2 — Wybór terminu */}
        <div id="booking" className="pt-14 border-b border-gray-100 pb-10">
          <StepHeading number={2} label="Wybierz termin" />

          {loading && (
            <p className="text-gray-400 text-sm">Ładowanie terminów...</p>
          )}
          {fetchError && (
            <p className="text-red-600 text-sm">{fetchError}</p>
          )}
          {!loading && !fetchError && (
            <SlotPicker
              slots={slots}
              selectedSlot={selectedSlot}
              onSelect={(slot) => {
                setSelectedSlot(slot);
                setTimeout(() => {
                  document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 120);
              }}
            />
          )}
        </div>

        {/* Krok 3 — Dane kontaktowe */}
        <div id="form-section" className="pt-14">
          <StepHeading number={3} label="Podaj dane kontaktowe" />
          <BookingForm
            selectedSlot={selectedSlot}
            onBook={handleBook}
            submitting={submitting}
          />
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-6">
        <p className="text-center text-xs text-gray-400">
          Profitia Management Consultants Mazurowski i Wspólnicy Sp. J. · ul. Puławska 145, 02-715 Warszawa
        </p>
      </div>
    </div>
  );
}
