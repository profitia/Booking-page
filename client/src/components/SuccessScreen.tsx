export default function SuccessScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Dziękujemy, termin został zarezerwowany.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Skontaktujemy się z Tobą wkrótce w celu potwierdzenia spotkania i przesłania linku
          do rozmowy online.
        </p>
      </div>
    </div>
  );
}
