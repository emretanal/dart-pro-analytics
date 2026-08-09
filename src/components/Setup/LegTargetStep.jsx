export default function LegTargetStep({ onSelect, onBack, lang = 'tr' }) {
  const t = {
    tr: {
      title: 'Kaç Leg Kazanan Galip Sayılsın?',
      subtitle: 'Maçı kazanmak için gereken leg sayısını belirleyin',
      back: 'Geri',
      single: 'Tek Leg'
    },
    en: {
      title: 'First to How Many Legs?',
      subtitle: 'Set required legs to win the match',
      back: 'Back',
      single: 'Single Leg'
    }
  }[lang];

  const options = [
    { legs: 1, label: `1 Leg (${t.single})` },
    { legs: 3, label: '3 Leg (First to 3)' },
    { legs: 5, label: '5 Leg (First to 5)' },
    { legs: 7, label: '7 Leg (First to 7)' },
    { legs: 9, label: '9 Leg (First to 9)' },
    { legs: 11, label: '11 Leg (First to 11)' },
  ];

  return (
    <div className="setup-card hero-card">
      <div className="setup-header-icon">🏆</div>
      <h2 className="setup-title">{t.title}</h2>
      <p className="setup-subtitle">{t.subtitle}</p>

      <div className="leg-select-grid">
        {options.map((option) => (
          <button
            key={option.legs}
            className="btn btn-primary btn-leg-step"
            onClick={() => onSelect(option.legs)}
          >
            <span className="leg-count-num">{option.legs} Leg</span>
            <span className="leg-count-sub">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="setup-action-row" style={{ marginTop: '20px' }}>
        <button type="button" className="btn-setup-back" onClick={onBack}>
          {t.back}
        </button>
      </div>
    </div>
  );
}