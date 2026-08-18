export default function PlayerCountStep({ onSelect, onBack, lang = 'tr' }) {
  const options = [1, 2, 3, 4];

  return (
    <div className="hero-card">
      <div className="setup-header-icon">🎯</div>
      <h1 className="setup-title">
        {lang === 'tr' ? 'Kaç Oyuncu Oynayacak?' : 'How Many Players?'}
      </h1>
      <p className="setup-subtitle">
        {lang === 'tr' ? 'Oyuncu sayısını seçin (Maks. 4)' : 'Select number of players (Max 4)'}
      </p>

      <div className="player-count-grid">
        {options.map((count) => (
          <button
            key={count}
            className="btn-count-step"
            onClick={() => onSelect(count)}
          >
            <span className="btn-num">{count}</span>
            <span className="btn-text-sub">
              {lang === 'tr' ? 'Oyuncu' : 'Player(s)'}
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