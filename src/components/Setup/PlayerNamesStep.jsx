import { useState } from 'react';

export default function PlayerNamesStep({ playerCount, onSubmit, onBack, lang }) {
  const isTr = lang === 'tr';

  // Geçmişte kaydedilmiş oyuncu isimlerini yükle (Geçmiş yoksa boş liste)
  const [savedNames] = useState(() => {
    const saved = localStorage.getItem('dart_saved_player_names');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Kayıtlı isimler okunamadı:', e);
      }
    }
    return []; // Geçmişte kayıtlı isim yoksa öneri verme!
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

    // Yeni girilen isimleri hafızadaki benzersiz listeye ekle ve kaydet
    const updatedSaved = Array.from(new Set([...cleanedNames, ...savedNames]));
    localStorage.setItem('dart_saved_player_names', JSON.stringify(updatedSaved));

    onSubmit(cleanedNames);
  };

  return (
    <div className="hero-card">
      <div className="setup-header-icon">👥</div>
      <h2 className="setup-title">{isTr ? 'Oyuncu İsimleri' : 'Player Names'}</h2>
      <p className="setup-subtitle">
        {isTr ? 'Tüm oyuncular için isim yazın veya listeden seçin.' : 'Type names or select from list for all players.'}
      </p>

      <form className="names-form" onSubmit={handleSubmit}>
        <div className="names-input-list">
          {names.map((name, idx) => {
            const defaultPlaceholder = `${isTr ? 'Oyuncu' : 'Player'} ${idx + 1}`;
            const currentVal = name.trim().toLowerCase();

            // Sadece geçmişte gerçek maça girmiş kayıtlı isimler varsa öner
            const suggestions = savedNames.filter((savedName) => {
              const nameLower = savedName.toLowerCase();
              const isAlreadyChosen = names.some(
                (n, i) => i !== idx && n.trim().toLowerCase() === nameLower
              );

              if (isAlreadyChosen) return false;
              if (currentVal === '' || currentVal.startsWith(isTr ? 'oyuncu' : 'player')) return true;

              return nameLower.includes(currentVal);
            });

            const isFocused = activeFocusedIndex === idx;
            const showDropdown = isFocused && suggestions.length > 0;

            return (
              <div key={idx} className={`name-input-wrapper ${isFocused ? 'is-active' : ''}`}>
                <div className="name-input-group">
                  <span className="player-badge">P{idx + 1}</span>
                  <input
                    type="text"
                    className="name-input-field"
                    value={name}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    onFocus={() => {
                      setActiveFocusedIndex(idx);
                      // Tıklandığında varsayılan "Oyuncu X" ismini otomatik temizle
                      if (
                        name.trim() === defaultPlaceholder ||
                        name.trim().toLowerCase().startsWith(isTr ? 'oyuncu' : 'player')
                      ) {
                        handleInputChange(idx, '');
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setActiveFocusedIndex(null), 200);
                      // Boş bırakılırsa varsayılan ismi geri yükle
                      if (!name.trim()) {
                        handleInputChange(idx, defaultPlaceholder);
                      }
                    }}
                    placeholder={defaultPlaceholder}
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