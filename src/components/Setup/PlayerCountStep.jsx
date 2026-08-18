export default function PlayerCountStep({ onSelect, onBack, lang = 'tr' }) {
  const options = [1, 2, 3, 4];

  return (
    <div className="hero-card" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div className="setup-header-icon" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎯</div>
      <h1 className="setup-title" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0', textAlign: 'center' }}>
        {lang === 'tr' ? 'Kaç Oyuncu Oynayacak?' : 'How Many Players?'}
      </h1>
      <p className="setup-subtitle" style={{ fontSize: '0.88rem', color: '#8a8b9e', margin: '0 0 20px 0', textAlign: 'center' }}>
        {lang === 'tr' ? 'Oyuncu sayısını seçin (Maks. 4)' : 'Select number of players (Max 4)'}
      </p>

      {/* 2x2 KESİN IZGARA DÜZENİ (INLINE GRID) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          width: '100%',
          boxSizing: 'border-box',
          marginBottom: '16px'
        }}
      >
        {options.map((count) => (
          <button
            key={count}
            onClick={() => onSelect(count)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify-content: 'center',
              gap: '10px',
              height: '60px',
              borderRadius: '12px',
              background: '#1a1b23',
              border: '1px solid #3d3e52',
              color: '#ffffff',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
              padding: '0 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <span 
              style={{
                fontSize: '1.2rem',
                fontWeight: '900',
                color: '#4da6ff',
                background: 'rgba(77, 166, 255, 0.15)',
                padding: '4px 10px',
                borderRadius: '8px'
              }}
            >
              {count}
            </span>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
              {lang === 'tr' ? 'Oyuncu' : 'Player(s)'}
            </span>
          </button>
        ))}
      </div>

      {/* GERİ BUTONU */}
      <div style={{ width: '100%', display: 'flex', boxSizing: 'border-box' }}>
        <button
          onClick={onBack}
          style={{
            width: '100%',
            height: '48px',
            background: '#2b2c3a',
            color: '#8a8b9e',
            border: '1px solid #3d3e52',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justify-content: 'center'
          }}
        >
          {lang === 'tr' ? 'Geri' : 'Back'}
        </button>
      </div>
    </div>
  );
}