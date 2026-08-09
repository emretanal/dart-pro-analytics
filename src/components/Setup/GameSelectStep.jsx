import { useState } from 'react';

export default function GameSelectStep({ onSelect, onBack, lang = 'tr' }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const t = {
    tr: {
      title: 'Oyun Türü Seçin',
      subtitle: 'Oynamak istediğiniz dart oyununu belirleyin',
      submodeSelect: 'Oyun Modu Seçin:',
      back: 'Geri',
      cricketTitle: 'Cricket Oyunları',
      cricketDesc: '15-20, Extended, Cut-Throat ve Wild-Card Cricket modları',
      cStandard: 'Standart Cricket (15-20 & Bull)',
      cStandardDesc: 'Klasik sayı kapatma ve puan toplama modu',
      cExtended: 'Extended Cricket (20-10, B, T, D, H)',
      cExtendedDesc: '20-10, Bull, Triple, Double ve House (H) hedefleri',
      cCutthroat: 'Cezalı Cricket (Cut-Throat)',
      cCutthroatDesc: 'Fazla vuruşlar rakibe ceza puanı olarak eklenir',
      cNoscore: 'No-Score Cricket',
      cNoscoreDesc: 'Puanlama yok; hedefleri ilk kapatan kazanır',
      cWildcard: 'Wild-Card Cricket',
      cWildcardDesc: 'Her leg başında rastgele 7 sayı belirlenir',
      x01Title: 'X01 Oyunları',
      x01Desc: '301, 501 ve 701 eksiltme oyunları',
      x501Desc: 'Standart profesyonel eksiltme oyunu',
      x301Desc: 'Hızlı ve kısa eksiltme oyunu',
      x701Desc: 'Uzun maraton eksiltme oyunu'
    },
    en: {
      title: 'Select Game Type',
      subtitle: 'Choose the dart game you want to play',
      submodeSelect: 'Select Game Mode:',
      back: 'Back',
      cricketTitle: 'Cricket Games',
      cricketDesc: '15-20, Extended, Cut-Throat and Wild-Card modes',
      cStandard: 'Standard Cricket (15-20 & Bull)',
      cStandardDesc: 'Classic number closure and scoring mode',
      cExtended: 'Extended Cricket (20-10, B, T, D, H)',
      cExtendedDesc: '20-10, Bull, Triple, Double and House (H) targets',
      cCutthroat: 'Cut-Throat Cricket',
      cCutthroatDesc: 'Extra hits add penalty points to opponents',
      cNoscore: 'No-Score Cricket',
      cNoscoreDesc: 'No points; first to close all targets wins',
      cWildcard: 'Wild-Card Cricket',
      cWildcardDesc: 'Random 7 targets chosen at start of each leg',
      x01Title: 'X01 Games',
      x01Desc: '301, 501 and 701 countdown games',
      x501Desc: 'Standard professional countdown game',
      x301Desc: 'Fast and short countdown game',
      x701Desc: 'Long marathon countdown game'
    }
  }[lang];

  const games = [
    { 
      id: 'cricket', 
      name: t.cricketTitle, 
      desc: t.cricketDesc,
      hasSubmodes: true,
      submodes: [
        { id: 'standard', name: t.cStandard, desc: t.cStandardDesc },
        { id: 'extended', name: t.cExtended, desc: t.cExtendedDesc },
        { id: 'cutthroat', name: t.cCutthroat, desc: t.cCutthroatDesc },
        { id: 'noscore', name: t.cNoscore, desc: t.cNoscoreDesc },
        { id: 'wildcard', name: t.cWildcard, desc: t.cWildcardDesc }
      ]
    },
    { 
      id: 'x01', 
      name: t.x01Title, 
      desc: t.x01Desc,
      hasSubmodes: true,
      submodes: [
        { id: '501', name: '501', desc: t.x501Desc },
        { id: '301', name: '301', desc: t.x301Desc },
        { id: '701', name: '701', desc: t.x701Desc }
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
      <h2 className="setup-title">{t.title}</h2>
      <p className="setup-subtitle">{t.subtitle}</p>

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
            {t.submodeSelect}
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
          {t.back}
        </button>
      </div>
    </div>
  );
}