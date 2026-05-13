export default function Hero() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <p className="text-xs font-semibold text-blue-700 mb-4 tracking-widest uppercase">
          Profitia Management Consultants
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
          Umów termin rozmowy badawczej (IDI)
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-4">
          Zapraszamy do udziału w badaniu jakościowym prowadzonym metodą indywidualnego wywiadu
          pogłębionego (IDI). Rozmowa trwa <strong>90 minut</strong> i odbywa się{' '}
          <strong>online</strong>, przez Microsoft Teams.
        </p>
        <p className="text-base text-gray-500 leading-relaxed">
          Badanie skierowane jest do osób odpowiedzialnych za zakupy, negocjacje z dostawcami
          lub zarządzanie kosztami w organizacji. Udział jest bezpłatny.
        </p>
        <a
          href="#booking"
          className="inline-block mt-8 px-6 py-3 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
        >
          Wybierz termin
        </a>
      </div>
    </div>
  );
}
