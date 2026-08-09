export default function PlayerCountStep({ onSelect }) {
  const options = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="setup-card hero-card">
      <div className="setup-header-icon">🎯</div>
      <h2 className="setup-title">Kaç Oyuncu Oynayacak?</h2>
      <p className="setup-subtitle">Oyuncu sayısını seçerek maça başlayın</p>
      
      <div className="player-count-grid">
        {options.map((count) => (
          <button
            key={count}
            className="btn btn-primary btn-count-step"
            onClick={() => onSelect(count)}
          >
            {count} Oyuncu
          </button>
        ))}
      </div>
    </div>
  );
}