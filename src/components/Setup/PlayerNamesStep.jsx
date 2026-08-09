import { useState } from 'react';

export default function PlayerNamesStep({ playerCount, onSubmit, onBack, lang = 'tr' }) {
  const t = {
    tr: {
      title: 'Oyuncu İsimleri',
      subtitle: 'Oyuncuların isimlerini girin',
      defaultName: 'Oyuncu',
      back: 'Geri',
      start: 'Maça Başla 🎯'
    },
    en: {
      title: 'Player Names',
      subtitle: 'Enter player names',
      defaultName: 'Player',
      back: 'Back',
      start: 'Start Match 🎯'
    }
  }[lang];

  const [names, setNames] = useState(
    Array.from({ length: playerCount }, (_, i) => `${t.defaultName} ${i + 1}`)
  );

  const handleNameChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalNames = names.map((n, i) => n.trim() || `${t.defaultName} ${i + 1}`);
    onSubmit(finalNames);
  };

  return (
    <div className="setup-card hero-card">
      <div className="setup-header-icon">👥</div>
      <h2 className="setup-title">{t.title}</h2>
      <p className="setup-subtitle">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="names-form">
        <div className="names-input-list">
          {names.map((name, index) => (
            <div key={index} className="name-input-group">
              <span className="player-badge">{index + 1}</span>
              <input
                type="text"
                className="name-input-field"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`${t.defaultName} ${index + 1}`}
                maxLength={15}
              />
            </div>
          ))}
        </div>

        <div className="setup-action-row">
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