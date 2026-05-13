export default function Hero() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 animate-fadeIn">
        <p className="text-xs font-semibold text-blue-700 mb-3 tracking-widest uppercase">
          Profitia Management Consultants
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-5">
          Umów termin rozmowy badawczej (IDI)
        </h1>
        <div className="text-sm sm:text-base text-gray-600 leading-relaxed space-y-3 max-w-2xl">
          <p>
            Zapraszamy do udziału w badaniu jakościowym prowadzonym metodą indywidualnego wywiadu
            pogłębionego (IDI). Rozmowa trwa około <strong className="text-gray-800">90 minut</strong> i
            odbywa się online, za pośrednictwem <strong className="text-gray-800">Microsoft Teams</strong>.
          </p>
          <p>
            Celem badania jest poznanie Twojej opinii na temat aplikacji wspierającej pracę Kupców i
            Category Managerów w obszarze zakupów Direct (aplikacja nie jest skierowana do zakupów Indirect).
          </p>
          <p>
            Więcej informacji o aplikacji znajdziesz w poniższym materiale wideo oraz krótkiej prezentacji.
            Bardzo prosimy o zapoznanie się z nimi przed badaniem.
          </p>
          <p>
            Za udział w badaniu przewidziane jest{' '}
            <strong className="text-gray-800">wynagrodzenie — bon zakupowy o wartości 200 zł</strong> do
            wybranego sklepu (np. TK Maxx) lub sklepu internetowego (np. Allegro).
          </p>
          <p>
            Podaj swoje dane kontaktowe, wybierz dogodny termin, a badacz skontaktuje się z Tobą w celu
            potwierdzenia i ustalenia szczegółów rozmowy.
          </p>
        </div>
        <a
          href="#materialy"
          className="inline-block mt-6 px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
        >
          Przejdź dalej
        </a>
      </div>
    </div>
  );
}
