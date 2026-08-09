import { useState } from 'react';

export default function PlayerNamesStep({ playerCount, onSubmit, onBack }) {
  const [names, setNames] = useState(
    Array.from({ length: playerCount }, (_, i) => `Oyuncu ${i + 1}`)
  );

  const handleNameChange = (index, value) => {
    const updatedNames = [...names];
    updatedNames[index] = value;
    setNames(updatedNames);
  };

  const handleFocus = (index) => {
    const defaultName = `Oyuncu ${index + 1}`;
    if (names[index] === defaultName) {
      handleNameChange(index, '');
    }
  };

  const handleBlur = (index) => {
    if (names[index].trim() === '') {
      handleNameChange(index, `Oyuncu ${index + 1}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(names);
  };

  return (
    <div className="setup-card hero-card">
      <div className="setup-header-icon">👥</div>
      <h2 className="setup-title">Oyuncu İsimleri</h2>
      <p className="setup-subtitle">Maçta yer alacak isimleri düzenleyin</p>

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
                onFocus={() => handleFocus(index)}
                onBlur={() => handleBlur(index)}
                placeholder={`${index + 1}. Oyuncu İsmi`}
              />
            </div>
          ))}
        </div>

        <div className="setup-action-row">
          <button type="button" className="btn-setup-back" onClick={onBack}>
            Geri
          </button>
          <button type="submit" className="btn-setup-submit">
            Devam Et
          </button>
        </div>
      </form>
    </div>
  );
}