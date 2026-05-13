export default function Materials() {
  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Materiały informacyjne</h2>
        <p className="text-sm text-gray-500 mb-6">
          Przed rozmową zachęcamy do zapoznania się z poniższymi materiałami.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://www.youtube.com/watch?v=PLACEHOLDER"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Obejrzyj film wprowadzający
          </a>
          <a
            href="/materials/informacja-o-badaniu.pdf"
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Pobierz informacje o badaniu (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
