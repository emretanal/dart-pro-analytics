export default function PlayerCountStep({ onSelect, onBack, lang = 'tr' }) {
  const t = {
    tr: {
      title: 'Kaç Oyuncu Oynayacak?',
      subtitle: 'Oyuncu sayısını seçin (Maks. 4)',
      player: 'Oyuncu',
      back: 'Geri'
    },
    en: {
      title: 'How Many Players?',
      subtitle: 'Select number of players (Max 4)',
      player: 'Player(s)',
      back: 'Back'
    }
  }[lang];

  const counts = [1, 2, 3, 4];

  return (
    <div className="hero-card">
      <div className="setup-header-icon">🎯</div>
      <h2 className="setup-title">{t.title}</h2>
      <p className="setup-subtitle">{t.subtitle}</p>

      <div className="player-count-grid">
        {counts.map((count) => (
          <button
            key={count}
            className="btn-count-step"
            onClick={() => onSelect(count)}
          >
            <span className="btn-num">{count}</span>
            <span className="btn-text-sub">{t.player}</span>
          </button>
        ))}
      </div>

      <div className="setup-action-row" style={{ marginTop: '16px' }}>
        <button type="button" className="btn-setup-back" onClick={onBack}>
          {t.back}
        </button>
      </div>
    </div>
  );
}