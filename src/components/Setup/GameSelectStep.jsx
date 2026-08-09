import { useState } from 'react';

export default function GameSelectStep({ onSelect, onBack }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    { 
      id: 'cricket', 
      name: 'Cricket Oyunları', 
      desc: '15-20, Extended, Cut-Throat ve Wild-Card Cricket modları',
      hasSubmodes: true,
      submodes: [
        { id: 'standard', name: 'Standart Cricket (15-20 & Bull)', desc: 'Klasik sayı kapatma ve puan toplama modu' },
        { id: 'extended', name: 'Extended Cricket (20-10, B, T, D, H)', desc: '20-10, Bull, Triple, Double ve House (H) hedefleri' },
        { id: 'cutthroat', name: 'Cezalı Cricket (Cut-Throat)', desc: 'Fazla vuruşlar rakibe ceza puanı olarak eklenir' },
        { id: 'noscore', name: 'No-Score Cricket', desc: 'Puanlama yok; hedefleri ilk kapatan kazanır' },
        { id: 'wildcard', name: 'Wild-Card Cricket', desc: 'Her leg başında rastgele 7 sayı belirlenir' }
      ]
    },
    { 
      id: 'x01', 
      name: 'X01 Oyunları', 
      desc: '301, 501 ve 701 eksiltme oyunları',
      hasSubmodes: true,
      submodes: [
        { id: '501', name: '501', desc: 'Standart profesyonel eksiltme oyunu' },
        { id: '301', name: '301', desc: 'Hızlı ve kısa eksiltme oyunu' },
        { id: '701', name: '701', desc: 'Uzun maraton eksiltme oyunu' }
      ]
    },
  ];

  const handleGameClick = (game) => {
    if (game.disabled) return;
    if (game.hasSubmodes) {
      setSelectedGame(game.id);
    } else {
      onSelect(game.id, 'standard');
    }
  };

  return (
    <div className="setup-card hero-card">
      <div className="setup-header-icon">🕹️</div>
      <h2 className="setup-title">Oyun Türü Seçin</h2>
      <p className="setup-subtitle">Oynamak istediğiniz dart oyununu belirleyin</p>

      {!selectedGame ? (
        <div className="game-select-list">
          {games.map((game) => (
            <button
              key={game.id}
              className={`btn-game-card ${game.disabled ? 'disabled' : ''}`}
              onClick={() => handleGameClick(game)}
              disabled={game.disabled}
            >
              <div className="game-card-title">{game.name}</div>
              <div className="game-card-desc">{game.desc}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="game-select-list">
          <div style={{ color: '#4da6ff', fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1rem' }}>
            Alt Oyun Modu Seçin:
          </div>
          {games.find(g => g.id === selectedGame)?.submodes.map((sub) => (
            <button
              key={sub.id}
              className="btn-game-card"
              onClick={() => onSelect(selectedGame, sub.id)}
            >
              <div className="game-card-title">{sub.name}</div>
              <div className="game-card-desc">{sub.desc}</div>
            </button>
          ))}
        </div>
      )}

      <div className="setup-action-row" style={{ marginTop: '20px' }}>
        <button 
          type="button" 
          className="btn-setup-back" 
          onClick={() => selectedGame ? setSelectedGame(null) : onBack()}
        >
          Geri
        </button>
      </div>
    </div>
  );
}