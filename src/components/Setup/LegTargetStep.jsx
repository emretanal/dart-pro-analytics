export default function LegTargetStep({ onSelect, onBack, lang = 'tr' }) {
  const options = [
    { value: 1, label: '1 Leg', subTr: 'Tek Leg', subEn: 'First to 1' },
    { value: 3, label: '3 Leg', subTr: 'First to 3', subEn: 'First to 3' },
    { value: 5, label: '5 Leg', subTr: 'First to 5', subEn: 'First to 5' },
    { value: 7, label: '7 Leg', subTr: 'First to 7', subEn: 'First to 7' },
    { value: 9, label: '9 Leg', subTr: 'First to 9', subEn: 'First to 9' },
    { value: 11, label: '11 Leg', subTr: 'First to 11', subEn: 'First to 11' },
  ];

  return (
    <div className="hero-card" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div className="setup-header-icon" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏆</div>
      <h1 className="setup-title" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0', textAlign: 'center' }}>
        {lang === 'tr' ? 'Kaç Leg Kazanan Galip Sayılsın?' : 'How Many Legs to Win?'}
      </h1>
      <p className="setup-subtitle" style={{ fontSize: '0.88rem', color: '#8a8b9e', margin: '0 0 20px 0', textAlign: 'center' }}>
        {lang === 'tr' ? 'Maçı kazanmak için gereken leg sayısını belirleyin' : 'Set the number of legs needed to win the match'}
      </p>

      {/* 2 SÜTUNLU GARANTİ IZGARA DÜZENİ (INLINE GRID) */}
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
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify-content: 'center',
              padding: '12px 8px',
              borderRadius: '12px',
              background: '#1a1b23',
              border: '1px solid #3d3e52',
              color: '#ffffff',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
              {opt.label}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#8a8b9e' }}>
              {lang === 'tr' ? opt.subTr : opt.subEn}
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