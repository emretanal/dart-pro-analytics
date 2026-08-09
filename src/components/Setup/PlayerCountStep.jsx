export default function PlayerCountStep({ onSelect, lang = 'tr' }) {
  const t = {
    tr: {
      title: 'Kaç Oyuncu Oynayacak?',
      subtitle: 'Oyuncu sayısını seçerek maça başlayın',
      player: 'Oyuncu'
    },
    en: {
      title: 'How Many Players?',
      subtitle: 'Select number of players to start',
      player: 'Player(s)'
    }
  }[lang];

  const counts = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="setup-card hero-card">
      <div className="setup-header-icon">🎯</div>
      <h2 className="setup-title">{t.title}</h2>
      <p className="setup-subtitle">{t.subtitle}</p>

      <div className="player-count-grid">
        {counts.map((count) => (
          <button
            key={count}
            className="btn btn-primary btn-count-step"
            onClick={() => onSelect(count)}
          >
            <span className="btn-num">{count}</span>
            <span className="btn-text-sub">{t.player}</span>
          </button>
        ))}
      </div>
    </div>
  );
}