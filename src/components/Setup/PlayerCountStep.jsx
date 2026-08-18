export default function PlayerCountStep({ onSelect, onBack, lang = 'tr' }) {
  const options = [1, 2, 3, 4];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#222330',
        border: '1px solid #333446',
        borderRadius: '20px',
        padding: '24px 18px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
        marginTop: '5px'
      }}
    >
      <div style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🎯</div>
      <h1
        style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          color: '#ffffff',
          margin: '0 0 6px 0',
          textAlign: 'center'
        }}
      >
        {lang === 'tr' ? 'Kaç Oyuncu Oynayacak?' : 'How Many Players?'}
      </h1>
      <p
        style={{
          fontSize: '0.88rem',
          color: '#8a8b9e',
          margin: '0 0 20px 0',
          textAlign: 'center'
        }}
      >
        {lang === 'tr' ? 'Oyuncu sayısını seçin (Maks. 4)' : 'Select number of players (Max 4)'}
      </p>

      {/* 2x2 KESİN IZGARA DÜZENİ */}
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
              justifyContent: 'center',
              gap: '10px',
              height: '62px',
              borderRadius: '12px',
              background: '#1a1b23',
              border: '1px solid #3d3e52',
              color: '#ffffff',
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
              padding: '0 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              outline: 'none'
            }}
          >
            <div
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
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
              {lang === 'tr' ? 'Oyuncu' : 'Player(s)'}
            </div>
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
            justifyContent: 'center',
            outline: 'none'
          }}
        >
          {lang === 'tr' ? 'Geri' : 'Back'}
        </button>
      </div>
    </div>
  );
}