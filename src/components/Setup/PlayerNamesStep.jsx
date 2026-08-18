import { useState } from 'react';

export default function PlayerNamesStep({ playerCount, onSubmit, onBack, lang }) {
  const isTr = lang === 'tr';

  const [savedNames] = useState(() => {
    const saved = localStorage.getItem('dart_saved_player_names');
    return saved ? JSON.parse(saved) : ['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4'];
  });

  const [names, setNames] = useState(() => {
    return Array.from({ length: playerCount }, (_, i) => `${isTr ? 'Oyuncu' : 'Player'} ${i + 1}`);
  });

  const [activeFocusedIndex, setActiveFocusedIndex] = useState(null);

  const handleInputChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleSelectSuggestion = (index, suggestedName) => {
    const updated = [...names];
    updated[index] = suggestedName;
    setNames(updated);
    setActiveFocusedIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedNames = names.map((n, i) => n.trim() || `${isTr ? 'Oyuncu' : 'Player'} ${i + 1}`);

    const updatedSaved = Array.from(new Set([...cleanedNames, ...savedNames]));
    localStorage.setItem('dart_saved_player_names', JSON.stringify(updatedSaved));

    onSubmit(cleanedNames);
  };

  return (
    <div className="hero-card">
      <div className="setup-header-icon">👥</div>
      <h2 className="setup-title">{isTr ? 'Oyuncu İsimleri' : 'Player Names'}</h2>
      <p className="setup-subtitle">
        {isTr ? 'İsim yazmaya başlayın veya geçmişten seçin.' : 'Start typing or pick from history.'}
      </p>

      <form className="names-form" onSubmit={handleSubmit}>
        <div className="names-input-list">
          {names.map((name, idx) => {
            const currentVal = name.trim().toLowerCase();

            const suggestions = savedNames.filter((savedName) => {
              const nameLower = savedName.toLowerCase();
              const isAlreadyChosen = names.some(
                (n, i) => i !== idx && n.trim().toLowerCase() === nameLower
              );
              return !isAlreadyChosen && (currentVal === '' || nameLower.includes(currentVal));
            });

            const showDropdown = activeFocusedIndex === idx && suggestions.length > 0;

            return (
              <div key={idx} className="name-input-wrapper">
                <div className="name-input-group">
                  <span className="player-badge">P{idx + 1}</span>
                  <input
                    type="text"
                    className="name-input-field"
                    value={name}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onFocus={() => setActiveFocusedIndex(idx)}
                    onBlur={() => {
                      setTimeout(() => setActiveFocusedIndex(null), 200);
                    }}
                    placeholder={`${isTr ? 'Oyuncu' : 'Player'} ${idx + 1}`}
                    maxLength={15}
                  />
                </div>

                {showDropdown && (
                  <div className="suggestions-dropdown">
                    {suggestions.slice(0, 5).map((sugg, sIdx) => (
                      <div
                        key={sIdx}
                        className="suggestion-item"
                        onMouseDown={() => handleSelectSuggestion(idx, sugg)}
                      >
                        👤 {sugg}
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
            {isTr ? 'Geri' : 'Back'}
          </button>
          <button type="submit" className="btn-setup-submit">
            {isTr ? 'İleri ➔' : 'Next ➔'}
          </button>
        </div>
      </form>
    </div>
  );
}