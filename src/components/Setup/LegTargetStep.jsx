export default function LegTargetStep({ onSelect, onBack }) {
  const options = [
    { legs: 1, label: '1 Leg (Tek Leg)' },
    { legs: 3, label: '3 Leg (First to 3)' },
    { legs: 5, label: '5 Leg (First to 5)' },
    { legs: 7, label: '7 Leg (First to 7)' },
    { legs: 9, label: '9 Leg (First to 9)' },
    { legs: 11, label: '11 Leg (First to 11)' },
  ];

  return (
    <div className="setup-card hero-card">
      <div className="setup-header-icon">🏆</div>
      <h2 className="setup-title">Kaç Leg Kazanan Galip Sayılsın?</h2>
      <p className="setup-subtitle">Maçı kazanmak için gereken leg sayısını belirleyin</p>

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
          Geri
        </button>
      </div>
    </div>
  );
}