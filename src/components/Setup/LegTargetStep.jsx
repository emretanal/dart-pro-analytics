export default function LegTargetStep({ onSelect, onBack, lang = 'tr' }) {
  const options = [
    { value: 1, label: '1 Leg', subTr: 'Tek Leg', subEn: 'First to 1' },
    { value: 3, label: '3 Leg', subTr: 'First to 3', subEn: 'First to 3' },
    { value: 5, label: '5 Leg', subTr: 'First to 5', subEn: 'First to 5' },
    { value: 7, label: '7 Leg', subTr: 'First to 7', subEn: 'First to 7' },
    { value: 9, label: '9 Leg', subTr: 'First to 9', subEn: 'First to 9' },
    { value: 11, label: '11 Leg', subTr: 'First to 11', subEn: 'First to 11' },
  ];

  return (
    <div className="hero-card">
      <div className="setup-header-icon">🏆</div>
      <h1 className="setup-title">
        {lang === 'tr' ? 'Kaç Leg Kazanan Galip Sayılsın?' : 'How Many Legs to Win?'}
      </h1>
      <p className="setup-subtitle">
        {lang === 'tr'
          ? 'Maçı kazanmak için gereken leg sayısını belirleyin'
          : 'Set the number of legs needed to win the match'}
      </p>

      <div className="leg-select-grid">
        {options.map((opt) => (
          <button
            key={opt.value}
            className="btn-leg-step"
            onClick={() => onSelect(opt.value)}
          >
            <span className="leg-count-num">{opt.label}</span>
            <span className="leg-count-sub">
              {lang === 'tr' ? opt.subTr : opt.subEn}
            </span>
          </button>
        ))}
      </div>

      <div className="setup-action-row">
        <button className="btn-setup-back btn-full-back" onClick={onBack}>
          {lang === 'tr' ? 'Geri' : 'Back'}
        </button>
      </div>
    </div>
  );
}