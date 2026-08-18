import { useState } from 'react';

export default function BullOffStep({ players, onComplete, onBack, lang }) {
  const isTr = lang === 'tr';

  // Başlangıç sıralaması [0, 1, 2, ...]
  const [order, setOrder] = useState(() => players.map((_, idx) => idx));
  
  // Atış skorları (D-BULL: 50, BULL: 25, Dışarı: 0)
  const [hits, setHits] = useState({});

  // Skor seçildiğinde otomatik sırala (skor eşitse manuel sırayı korur)
  const handleHitSelect = (playerIdx, score) => {
    const updatedHits = { ...hits, [playerIdx]: score };
    setHits(updatedHits);

    const sortedOrder = [...order].sort((a, b) => {
      const scoreA = updatedHits[a] !== undefined ? updatedHits[a] : -1;
      const scoreB = updatedHits[b] !== undefined ? updatedHits[b] : -1;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return 0; // Puanlar eşitse mevcut manuel sırayı koru
    });

    setOrder(sortedOrder);
  };

  // Sıralamada oyuncuyu yukarı taşı
  const moveUp = (index) => {
    if (index === 0) return;
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  // Sıralamada oyuncuyu aşağı taşı
  const moveDown = (index) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  const handleConfirm = () => {
    onComplete(order, hits);
  };

  return (
    <div className="hero-card">
      <div className="setup-header-icon">🎯</div>
      <h2 className="setup-title">
        {isTr ? 'Bull-Off (Başlangıç Sıralaması)' : 'Bull-Off (Order Determination)'}
      </h2>
      <p className="setup-subtitle">
        {isTr
          ? 'Atış sonucunu girin veya tahta üzerindeki merkeze yakınlığa göre ⬆️ ⬇️ butonlarıyla sıralamayı düzenleyin.'
          : 'Select hit result or use ⬆️ ⬇️ buttons based on distance to center.'}
      </p>

      <div className="bulloff-order-list">
        {order.map((playerIdx, rank) => {
          const playerName = players[playerIdx];
          const currentHit = hits[playerIdx];

          return (
            <div key={playerIdx} className="bulloff-order-card">
              <div className="bulloff-rank-badge">
                {rank + 1}. {isTr ? 'Sırada' : 'Pos'}
              </div>

              <div className="bulloff-player-info">
                <span className="bulloff-player-name">{playerName}</span>
                <div className="bulloff-hit-buttons">
                  <button
                    type="button"
                    className={`btn-hit-chip dbull ${currentHit === 50 ? 'active' : ''}`}
                    onClick={() => handleHitSelect(playerIdx, 50)}
                  >
                    D-BULL
                  </button>
                  <button
                    type="button"
                    className={`btn-hit-chip sbull ${currentHit === 25 ? 'active' : ''}`}
                    onClick={() => handleHitSelect(playerIdx, 25)}
                  >
                    BULL
                  </button>
                  <button
                    type="button"
                    className={`btn-hit-chip miss ${currentHit === 0 ? 'active' : ''}`}
                    onClick={() => handleHitSelect(playerIdx, 0)}
                  >
                    {isTr ? 'Dışarı' : 'Miss'}
                  </button>
                </div>
              </div>

              <div className="bulloff-move-buttons">
                <button
                  type="button"
                  className="btn-move"
                  onClick={() => moveUp(rank)}
                  disabled={rank === 0}
                  title={isTr ? 'Yukarı Taşı' : 'Move Up'}
                >
                  ⬆️
                </button>
                <button
                  type="button"
                  className="btn-move"
                  onClick={() => moveDown(rank)}
                  disabled={rank === order.length - 1}
                  title={isTr ? 'Aşağı Taşı' : 'Move Down'}
                >
                  ⬇️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="setup-action-row">
        <button type="button" className="btn-setup-back" onClick={onBack}>
          {isTr ? 'Geri' : 'Back'}
        </button>

        <button type="button" className="btn-setup-submit" onClick={handleConfirm}>
          {isTr ? 'Sıralamayı Onayla & Başla ➔' : 'Confirm Order & Start ➔'}
        </button>
      </div>
    </div>
  );
}