export default function Materials() {
  return (
    <div id="materialy" className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex-shrink-0">1</span>
          <h2 className="text-lg font-semibold text-gray-900">Zapoznaj się z materiałami</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-10">
          Bardzo prosimy o przejrzenie poniższych materiałów przed rozmową.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Card 1 — Wideo */}
          <a
            href="https://www.youtube.com/watch?v=PLACEHOLDER"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 animate-fadeIn"
          >
            <div className="text-2xl mb-3">🎥</div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
              Obejrzyj materiał wideo
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">
              Krótki materiał pokazujący aplikację i kontekst badania.
            </p>
            <span className="mt-4 text-sm font-medium text-blue-700 group-hover:underline">
              Otwórz YouTube →
            </span>
          </a>

          {/* Card 2 — PDF */}
          <a
            href="/materials/informacja-o-badaniu.pdf"
            download
            className="group flex flex-col bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 animate-fadeIn"
            style={{ animationDelay: '80ms' }}
          >
            <div className="text-2xl mb-3">📄</div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
              Pobierz prezentację PDF
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1">
              Krótka prezentacja aplikacji i zakresu badania.
            </p>
            <span className="mt-4 text-sm font-medium text-blue-700 group-hover:underline">
              Pobierz PDF →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
