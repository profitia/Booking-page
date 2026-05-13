import { useState, useEffect } from 'react';
import type { Slot } from './types';
import Hero from './components/Hero';
import Materials from './components/Materials';
import SlotPicker from './components/SlotPicker';
import BookingForm from './components/BookingForm';
import SuccessScreen from './components/SuccessScreen';

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
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <div id="booking" className="pt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Wybierz termin</h2>

          {loading && (
            <p className="text-gray-400 text-sm">Ładowanie terminów...</p>
          )}

          {fetchError && (
            <p className="text-red-600 text-sm">{fetchError}</p>
          )}

          {!loading && !fetchError && (
            <>
              <SlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />
              <BookingForm
                selectedSlot={selectedSlot}
                onBook={handleBook}
                submitting={submitting}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
