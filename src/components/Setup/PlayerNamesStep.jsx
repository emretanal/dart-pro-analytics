import { useState } from 'react';

export default function PlayerNamesStep({ playerCount, onSubmit, onBack, lang = 'tr' }) {
  // Alanlar boş başlar; "Oyuncu 1", "Oyuncu 2" vb. yalnızca placeholder olarak
  // görünür. Kullanıcı yazmaya başlayınca placeholder otomatik kaybolur,
  // hiç yazılmazsa gönderim sırasında (handleSubmit) aynı metin varsayılan
  // isim olarak kullanılır.
  const [names, setNames] = useState(() => Array(playerCount).fill(''));

  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [nameHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('dart_player_name_history') || '[]');
  });

  const handleNameChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleSelectSuggestion = (index, suggestion) => {
    handleNameChange(index, suggestion);
    setActiveInputIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalNames = names.map((n, i) => n.trim() || `${lang === 'tr' ? 'Oyuncu' : 'Player'} ${i + 1}`);
    
    const savedHistory = JSON.parse(localStorage.getItem('dart_player_name_history') || '[]');
    const newHistory = [...savedHistory];
    finalNames.forEach(name => {
      if (!newHistory.includes(name)) {
        newHistory.push(name);
      }
    });
    localStorage.setItem('dart_player_name_history', JSON.stringify(newHistory));

    onSubmit(finalNames);
  };

  return (
    <div className="hero-card">
      <div className="setup-header-icon">👥</div>
      <h1 className="setup-title">
        {lang === 'tr' ? 'Oyuncu İsimleri' : 'Player Names'}
      </h1>
      <p className="setup-subtitle">
        {lang === 'tr' ? 'Tüm oyuncular için isim yazın veya listeden seçin.' : 'Enter names for all players or pick from list.'}
      </p>

      <form className="names-form" onSubmit={handleSubmit}>
        <div className="names-input-list">
          {names.map((name, index) => {
            const suggestions = nameHistory.filter(
              (h) => h.toLowerCase().includes(name.toLowerCase()) && h !== name
            );

            return (
              <div 
                key={index} 
                className={`name-input-wrapper ${activeInputIndex === index ? 'is-active' : ''}`}
              >
                <div className="name-input-group">
                  <span className="player-badge">P{index + 1}</span>
                  <input
                    type="text"
                    className="name-input-field"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    onFocus={() => setActiveInputIndex(index)}
                    onBlur={() => setTimeout(() => setActiveInputIndex(null), 200)}
                    placeholder={`${lang === 'tr' ? 'Oyuncu' : 'Player'} ${index + 1}`}
                  />
                </div>

                {activeInputIndex === index && suggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {suggestions.map((sug, sIdx) => (
                      <div
                        key={sIdx}
                        className="suggestion-item"
                        onMouseDown={() => handleSelectSuggestion(index, sug)}
                      >
                        👤 {sug}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="setup-action-row">
          <button type="button" className="btn-setup-back" onClick={onBack}>
            {lang === 'tr' ? 'Geri' : 'Back'}
          </button>
          <button type="submit" className="btn-setup-submit">
            {lang === 'tr' ? 'İleri ➔' : 'Next ➔'}
          </button>
        </div>
      </form>
    </div>
  );
}