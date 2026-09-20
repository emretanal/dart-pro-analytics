import './SettingsModal.css';

/* Seçilebilir vurgu renkleri. Örnek nokta rengi, o renk temasının canlı
   dolgu tonudur (App.css içindeki --accent-color ile aynı). */
export const ACCENTS = [
  { id: 'green', swatch: '#10b981', tr: 'Yeşil', en: 'Green' },
  { id: 'blue', swatch: '#3b9eff', tr: 'Mavi', en: 'Blue' },
  { id: 'purple', swatch: '#a78bfa', tr: 'Mor', en: 'Purple' },
];

const SETTINGS_CONTENT = {
  tr: {
    title: '⚙️ Seçenekler',
    close: '✕ Kapat',
    themeLabel: 'GÖRÜNÜM',
    themeDesc: 'Uygulamanın renk temasını seçin.',
    dark: '🌙 Gece',
    light: '☀️ Gündüz',
    accentLabel: 'VURGU RENGİ',
    accentDesc: 'Butonlarda ve skorlarda kullanılan ana renk.',
    langLabel: 'DİL',
    langDesc: 'Arayüz dilini değiştirin.',
  },
  en: {
    title: '⚙️ Options',
    close: '✕ Close',
    themeLabel: 'APPEARANCE',
    themeDesc: 'Choose the colour theme of the app.',
    dark: '🌙 Dark',
    light: '☀️ Light',
    accentLabel: 'ACCENT COLOUR',
    accentDesc: 'The main colour used on buttons and scores.',
    langLabel: 'LANGUAGE',
    langDesc: 'Change the interface language.',
  },
};

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  setTheme,
  lang,
  setLang,
  accent,
  setAccent,
}) {
  if (!isOpen) return null;

  const c = SETTINGS_CONTENT[lang] || SETTINGS_CONTENT.tr;

  return (
    <div className="winner-overlay">
      <div className="history-modal settings-modal">
        <div className="guide-header">
          <h2>{c.title}</h2>
          <button className="btn-text" onClick={onClose}>
            {c.close}
          </button>
        </div>

        <div className="settings-body">
          <div className="settings-group">
            <div className="settings-group-label">{c.themeLabel}</div>
            <div className="settings-group-desc">{c.themeDesc}</div>
            <div className="settings-segmented">
              <button
                className={`settings-segment ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                {c.dark}
              </button>
              <button
                className={`settings-segment ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                {c.light}
              </button>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-label">{c.accentLabel}</div>
            <div className="settings-group-desc">{c.accentDesc}</div>
            <div className="settings-segmented">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  className={`settings-segment settings-accent ${accent === a.id ? 'active' : ''}`}
                  onClick={() => setAccent(a.id)}
                  aria-pressed={accent === a.id}
                >
                  <span className="accent-swatch" style={{ backgroundColor: a.swatch }} />
                  {lang === 'tr' ? a.tr : a.en}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-label">{c.langLabel}</div>
            <div className="settings-group-desc">{c.langDesc}</div>
            <div className="settings-segmented">
              <button
                className={`settings-segment ${lang === 'tr' ? 'active' : ''}`}
                onClick={() => setLang('tr')}
              >
                🇹🇷 Türkçe
              </button>
              <button
                className={`settings-segment ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
