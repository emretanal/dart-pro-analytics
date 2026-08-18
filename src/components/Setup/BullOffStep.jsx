import { useState } from 'react';

export default function BullOffStep({ players, onComplete, onBack, lang }) {
  const [bullHits, setBullHits] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const isTr = lang === 'tr';

  const handleHitSelect = (type) => {
    const updatedHits = { ...bullHits, [currentIndex]: type };
    setBullHits(updatedHits);

    if (currentIndex + 1 < players.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      calculateOrderAndFinish(updatedHits);
    }
  };

  const calculateOrderAndFinish = (hits) => {
    const playerIndices = players.map((_, idx) => idx);

    playerIndices.sort((a, b) => {
      const scoreA = hits[a] !== undefined ? hits[a] : 0;
      const scoreB = hits[b] !== undefined ? hits[b] : 0;
      return scoreB - scoreA;
    });

    onComplete(playerIndices, hits);
  };

  const handleResetCurrent = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const activePlayerName = players[currentIndex];

  return (
    <div className="hero-card">
      <div className="setup-header-icon">🎯</div>
      <h2 className="setup-title">{isTr ? 'Bull-Off (Başlangıç Atışı)' : 'Bull-Off (First Throw)'}</h2>
      <p className="setup-subtitle">
        {isTr
          ? 'İlk başlayacak oyuncuyu ve leg sırasını belirlemek için merkeze tek dart atın.'
          : 'Throw a single dart to determine starting player and leg order.'}
      </p>

      <div className="bulloff-player-card">
        <span className="bulloff-p-badge">P{currentIndex + 1}</span>
        <span className="bulloff-p-name">{activePlayerName}</span>
      </div>

      <div className="bulloff-btn-grid">
        <button className="btn-bulloff btn-dbull" onClick={() => handleHitSelect(50)}>
          🔴 D-BULL (50)
        </button>
        <button className="btn-bulloff btn-sbull" onClick={() => handleHitSelect(25)}>
          🟢 BULL (25)
        </button>
        <button className="btn-bulloff btn-missbull" onClick={() => handleHitSelect(0)}>
          ❌ MISS (0)
        </button>
      </div>

      <div className="bulloff-status-list">
        {players.map((name, idx) => {
          const hit = bullHits[idx];
          let label = isTr ? 'Bekliyor' : 'Waiting';
          let styleClass = '';

          if (hit === 50) { label = 'D-BULL (50)'; styleClass = 'hit-50'; }
          else if (hit === 25) { label = 'BULL (25)'; styleClass = 'hit-25'; }
          else if (hit === 0) { label = 'MISS (0)'; styleClass = 'hit-0'; }

          return (
            <div key={idx} className={`bulloff-status-item ${idx === currentIndex ? 'active-throw' : ''}`}>
              <span>{name}</span>
              <span className={`bulloff-hit-badge ${styleClass}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div className="setup-action-row">
        <button className="btn-setup-back" onClick={currentIndex === 0 ? onBack : handleResetCurrent}>
          {isTr ? 'Geri' : 'Back'}
        </button>
      </div>
    </div>
  );
}