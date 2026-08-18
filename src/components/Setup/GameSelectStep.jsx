import { useState } from 'react';
import HowToPlayModal from '../Help/HowToPlayModal';

export default function GameSelectStep({ onSelect, lang = 'tr' }) {
  const [subStep, setSubStep] = useState('main'); // 'main' | 'cricket' | 'x01'
  const [selectedX01Mode, setSelectedX01Mode] = useState('501');
  const [x01Rules, setX01Rules] = useState({ doubleIn: false, doubleOut: true });
  const [showGuide, setShowGuide] = useState(false);

  const handleCricketSelect = (mode) => {
    onSelect('cricket', mode);
  };

  const handleX01Submit = () => {
    onSelect('x01', selectedX01Mode, x01Rules);
  };

  return (
    <div className="hero-card">
      <div className="setup-header-icon">🎮</div>
      <h1 className="setup-title">
        {lang === 'tr' ? 'Oyun Türü Seçin' : 'Select Game Type'}
      </h1>
      <p className="setup-subtitle">
        {lang === 'tr' ? 'Oynamak istediğiniz dart oyununu belirleyin' : 'Choose your preferred game mode'}
      </p>

      {subStep === 'main' && (
        <>
          <div className="game-select-list">
            <button className="btn-game-card" onClick={() => setSubStep('cricket')}>
              <div className="game-card-title">Cricket {lang === 'tr' ? 'Oyunları' : 'Games'}</div>
              <div className="game-card-desc">15-20, Extended, Cut-Throat, Wild-Card</div>
            </button>

            <button className="btn-game-card" onClick={() => setSubStep('x01')}>
              <div className="game-card-title">X01 {lang === 'tr' ? 'Oyunları' : 'Games'}</div>
              <div className="game-card-desc">301, 501, 701</div>
            </button>
          </div>

          <button className="btn-how-to-play" onClick={() => setShowGuide(true)}>
            ❓ {lang === 'tr' ? 'Nasıl Oynanır?' : 'How to Play?'}
          </button>
        </>
      )}

      {subStep === 'cricket' && (
        <div className="game-select-list">
          <div className="sub-section-title">{lang === 'tr' ? 'Oyun Modu Seçin:' : 'Select Game Mode:'}</div>

          <button className="btn-game-card" onClick={() => handleCricketSelect('standard')}>
            <div className="game-card-title">{lang === 'tr' ? 'Standart Cricket (15-20 & Bull)' : 'Standard Cricket (15-20 & Bull)'}</div>
            <div className="game-card-desc">{lang === 'tr' ? 'Klasik sayı kapatma ve puan toplama modu' : 'Classic number closing and scoring mode'}</div>
          </button>

          <button className="btn-game-card" onClick={() => handleCricketSelect('extended')}>
            <div className="game-card-title">{lang === 'tr' ? 'Extended Cricket (20-10, B, T, D, H)' : 'Extended Cricket (20-10, B, T, D, H)'}</div>
            <div className="game-card-desc">20-10, Bull, Triple, Double, House (H)</div>
          </button>

          <button className="btn-game-card" onClick={() => handleCricketSelect('cutthroat')}>
            <div className="game-card-title">{lang === 'tr' ? 'Cezalı Cricket (Cut-Throat)' : 'Cut-Throat Cricket'}</div>
            <div className="game-card-desc">{lang === 'tr' ? 'Fazla vuruşlar rakibe ceza puanı olarak eklenir' : 'Extra hits add penalty points to opponents'}</div>
          </button>

          <button className="btn-game-card" onClick={() => handleCricketSelect('no-score')}>
            <div className="game-card-title">No-Score Cricket</div>
            <div className="game-card-desc">{lang === 'tr' ? 'Puanlama yok; hedefleri ilk kapatan kazanır' : 'No points; first to close all targets wins'}</div>
          </button>

          <button className="btn-game-card" onClick={() => handleCricketSelect('wildcard')}>
            <div className="game-card-title">Wild-Card Cricket</div>
            <div className="game-card-desc">{lang === 'tr' ? 'Her leg başında rastgele 7 sayı belirlenir' : 'Random 7 targets generated each leg'}</div>
          </button>

          <div className="setup-action-row">
            <button className="btn-setup-back" onClick={() => setSubStep('main')}>
              {lang === 'tr' ? 'Geri' : 'Back'}
            </button>
          </div>
        </div>
      )}

      {subStep === 'x01' && (
        <div className="game-select-list">
          <div className="sub-section-title">{lang === 'tr' ? 'Oyun Modu Seçin:' : 'Select Game Mode:'}</div>

          {['501', '301', '701'].map((mode) => (
            <button
              key={mode}
              className={`btn-game-card ${selectedX01Mode === mode ? 'active-mode' : ''}`}
              onClick={() => setSelectedX01Mode(mode)}
            >
              <div className="game-card-title">{mode}</div>
              <div className="game-card-desc">
                {mode === '501' && (lang === 'tr' ? 'Standart profesyonel eksiltme oyunu' : 'Standard professional countdown game')}
                {mode === '301' && (lang === 'tr' ? 'Hızlı ve kısa eksiltme oyunu' : 'Fast & short countdown game')}
                {mode === '701' && (lang === 'tr' ? 'Uzun maraton eksiltme oyunu' : 'Long marathon countdown game')}
              </div>
            </button>
          ))}

          <div className="sub-section-title" style={{ marginTop: '12px' }}>
            {lang === 'tr' ? 'X01 Kurallarını Belirleyin:' : 'Set X01 Rules:'}
          </div>

          <div className="x01-rules-container">
            <label className="toggle-rule-card">
              <input
                type="checkbox"
                checked={x01Rules.doubleIn}
                onChange={(e) => setX01Rules({ ...x01Rules, doubleIn: e.target.checked })}
              />
              <div className="toggle-rule-info">
                <span className="toggle-rule-title">Double In ({lang === 'tr' ? 'Çiftli Başlangıç' : 'Double Start'})</span>
                <span className="toggle-rule-desc">
                  {lang === 'tr' ? 'Puan eksiltmeye başlamak için ilk vuruşun Double olması gerekir.' : 'First hit must be a double to start scoring.'}
                </span>
              </div>
            </label>

            <label className="toggle-rule-card">
              <input
                type="checkbox"
                checked={x01Rules.doubleOut}
                onChange={(e) => setX01Rules({ ...x01Rules, doubleOut: e.target.checked })}
              />
              <div className="toggle-rule-info">
                <span className="toggle-rule-title">Double Out ({lang === 'tr' ? 'Çiftli Bitiş' : 'Double Finish'})</span>
                <span className="toggle-rule-desc">
                  {lang === 'tr' ? "Leg'i bitirmek için son vuruşun Double olması gerekir." : 'Final winning dart must hit a double.'}
                </span>
              </div>
            </label>
          </div>

          <div className="setup-action-row">
            <button className="btn-setup-back" onClick={() => setSubStep('main')}>
              {lang === 'tr' ? 'Geri' : 'Back'}
            </button>
            <button className="btn-setup-submit" onClick={handleX01Submit}>
              {lang === 'tr' ? 'Devam Et ➔' : 'Continue ➔'}
            </button>
          </div>
        </div>
      )}

      <HowToPlayModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        lang={lang}
      />
    </div>
  );
}