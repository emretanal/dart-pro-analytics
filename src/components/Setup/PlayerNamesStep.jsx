import { useState } from 'react';

export default function PlayerNamesStep({ playerCount, onSubmit, onBack, lang = 'tr' }) {
  const t = {
    tr: {
      title: 'Oyuncu İsimleri',
      subtitle: 'Oyuncuların isimlerini girin',
      playerDefault: 'Oyuncu',
      start: 'Oyunu Başlat ➔',
      back: 'Geri'
    },
    en: {
      title: 'Player Names',
      subtitle: 'Enter the names of the players',
      playerDefault: 'Player',
      start: 'Start Game ➔',
      back: 'Back'
    }
  }[lang];

  // Başlangıçta input değerlerini boş string ('') olarak tutuyoruz
  const [names, setNames] = useState(() => Array(playerCount).fill(''));

  const handleNameChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Eğer oyuncu isim alanını boş bıraktıysa varsayılan "Oyuncu 1", "Oyuncu 2" ismini ata
    const finalizedNames = names.map((name, i) => 
      name.trim() !== '' ? name.trim() : `${t.playerDefault} ${i + 1}`
    );
    onSubmit(finalizedNames);
  };

  return (
    <div className="hero-card">
      <div className="setup-header-icon">👥</div>
      <h2 className="setup-title">{t.title}</h2>
      <p className="setup-subtitle">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="names-form">
        <div className="names-input-list">
          {Array.from({ length: playerCount }).map((_, index) => (
            <div key={index} className="name-input-group">
              <span className="player-badge">P{index + 1}</span>
              <input
                type="text"
                className="name-input-field"
                value={names[index]}
                placeholder={`${t.playerDefault} ${index + 1}`}
                onChange={(e) => handleNameChange(index, e.target.value)}
                maxLength={15}
              />
            </div>
          ))}
        </div>

        <div className="setup-action-row" style={{ marginTop: '16px' }}>
          <button type="button" className="btn-setup-back" onClick={onBack}>
            {t.back}
          </button>
          <button type="submit" className="btn-setup-submit">
            {t.start}
          </button>
        </div>
      </form>
    </div>
  );
}