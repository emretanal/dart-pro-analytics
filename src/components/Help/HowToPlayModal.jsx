import { useState, useEffect } from 'react';
import './HowToPlayModal.css';

const GUIDE_CONTENT = {
  tr: {
    title: '📖 Dart Nasıl Oynanır?',
    close: '✕ Kapat',
    tabs: [
      { id: 'board', label: '🎯 Tahtayı Tanı' },
      { id: 'x01', label: '🔢 X01 Kuralları' },
      { id: 'cricket', label: '🏏 Cricket Kuralları' },
    ],
    board: {
      intro: 'Dart tahtası 1-20 arasındaki sayılardan ve merkez bölgesinden oluşur. Bir dilimin bölgeleri ve puan karşılıkları:',
      items: [
        { title: 'Single (Tekli Alan):', desc: 'Geniş alanlar. Sayının kendi değerini kazandırır (Örn: 20).', badge: 'x1' },
        { title: 'Double (Çiftli Halka - D):', desc: 'En dıştaki dar halka. Sayı değerini 2 ile çarpar (Örn: D20 = 40 Puan).', badge: 'x2' },
        { title: 'Triple (Üçlü Halka - T):', desc: 'İçteki dar halka. Sayı değerini 3 ile çarpar (Örn: T20 = 60 Puan).', badge: 'x3' },
        { title: 'Outer Bull (Dış Merkez):', desc: 'Yeşil merkez halka. 25 puan değerindedir.', badge: '25 Puan' },
        { title: 'Inner / Double Bull (İç Merkez):', desc: 'Kırmızı tam merkez. 50 puan değerindedir ve Double kuralında bitiş vuruşu sayılır.', badge: '50 Puan' },
      ]
    },
    x01: {
      intro: '301, 501 ve 701 oyunları eksiltme mantığıyla oynanır. Amaç puanı tam olarak 0\'a indirmektir.',
      steps: [
        'Her turda oyuncuların 3 dart atış hakkı vardır.',
        'Atılan her sayı toplam puandan düşülür.',
        'Double Out (Çiftli Bitiş): Oyunu bitiren son vuruş mutlaka bir Double (D) alanına gelmelidir.',
        'Double In (Çiftli Başlangıç): Aktif ise puan düşmeye başlamak için ilk vuruşun Double olması gerekir.',
        'BUST (Taşma): Kalan puandan fazla atarsanız veya puanı 1 yaparsanız tur geçersiz sayılır ve tur başındaki puana dönersiniz.'
      ]
    },
    cricket: {
      intro: 'Cricket oyununda amaç hedeflenen sayıları (15-20 ve Bull) 3 kez vurarak "kapatmak" ve rakipten fazla puan toplamaktır.',
      marks: [
        { symbol: '/', label: '1 İsabet (İnce Çizgi)' },
        { symbol: 'X', label: '2 İsabet (Çarpı)' },
        { symbol: '⭕', label: '3 İsabet (Kapalı / Closed)' }
      ],
      modes: [
        { title: 'Standart Cricket:', desc: 'Bir sayıyı kapattıktan sonra rakibiniz o sayıyı kapatmadıysa, o sayıya her isabetinizde sayı puanı kazanırsınız.' },
        { title: 'Cut-Throat (Cezalı):', desc: 'Kendi puanınızı artırmak yerine, kapattığınız sayıya attığınız ekstra isabetler henüz kapatmamış rakiplerinize ceza puanı olarak yazılır. En az puana sahip olan kazanır.' },
        { title: 'Extended Cricket:', desc: '10-20 arası tüm sayılar, Double (D), Triple (T) ve House (H) hedeflerini içerir.' }
      ]
    }
  },
  en: {
    title: '📖 How to Play Darts?',
    close: '✕ Close',
    tabs: [
      { id: 'board', label: '🎯 The Board' },
      { id: 'x01', label: '🔢 X01 Rules' },
      { id: 'cricket', label: '🏏 Cricket Rules' },
    ],
    board: {
      intro: 'A dartboard consists of numbers 1-20 and the central Bullseye. Here is the segment breakdown:',
      items: [
        { title: 'Single Segment:', desc: 'Large scoring areas. Scores face value (e.g., 20).', badge: 'x1' },
        { title: 'Double Ring (D):', desc: 'Outer narrow ring. Multiplies score by 2 (e.g., D20 = 40 Points).', badge: 'x2' },
        { title: 'Triple Ring (T):', desc: 'Inner narrow ring. Multiplies score by 3 (e.g., T20 = 60 Points).', badge: 'x3' },
        { title: 'Outer Bull:', desc: 'Outer green center circle. Worth 25 points.', badge: '25 Pts' },
        { title: 'Inner Bull / Double Bull:', desc: 'Inner red circle. Worth 50 points and counts as a double finish.', badge: '50 Pts' },
      ]
    },
    x01: {
      intro: '301, 501, and 701 are countdown games. The objective is to reach exactly 0 from your starting score.',
      steps: [
        'Each player throws 3 darts per turn.',
        'Points scored are subtracted from your remaining total.',
        'Double Out: The final winning dart must hit a Double (D) segment.',
        'Double In: If active, you must hit a double before you can start deducting points.',
        'BUST: Throwing more points than remaining resets your turn.'
      ]
    },
    cricket: {
      intro: 'In Cricket, the goal is to "close" target numbers (15-20 & Bull) by hitting them 3 times and outscore opponents.',
      marks: [
        { symbol: '/', label: '1 Hit (Single Slash)' },
        { symbol: 'X', label: '2 Hits (Cross)' },
        { symbol: '⭕', label: '3 Hits (Closed)' }
      ],
      modes: [
        { title: 'Standard Cricket:', desc: 'Once closed, hitting that segment scores points if opponents haven\'t closed it yet.' },
        { title: 'Cut-Throat:', desc: 'Extra hits add penalty points to opponents who haven\'t closed it. Lowest total points wins.' },
        { title: 'Extended Cricket:', desc: 'Includes targets from 10-20 plus Double (D), Triple (T), and House (H).' }
      ]
    }
  }
};

export default function HowToPlayModal({ isOpen, onClose, lang = 'tr', gameContext = null }) {
  const [activeTab, setActiveTab] = useState('board');

  // Bir oyun zaten seçiliyse (Cricket ya da X01 devam ediyorsa) rehber
  // doğrudan o oyunun kurallarını açsın; henüz oyun seçilmemişse (Oyun Türü
  // Seçin ekranı) tüm rehber sekmeleri erişilebilir kalsın.
  const isGameLocked = gameContext === 'cricket' || gameContext === 'x01';

  useEffect(() => {
    if (isOpen) {
      setActiveTab(isGameLocked ? gameContext : 'board');
    }
  }, [isOpen, gameContext, isGameLocked]);

  if (!isOpen) return null;

  const content = GUIDE_CONTENT[lang] || GUIDE_CONTENT.tr;
  const visibleTabs = isGameLocked
    ? content.tabs.filter((tab) => tab.id === gameContext)
    : content.tabs;

  return (
    <div className="winner-overlay">
      <div className="history-modal guide-modal">
        <div className="guide-header">
          <h2>{content.title}</h2>
          <button className="btn-text" onClick={onClose}>{content.close}</button>
        </div>

        {!isGameLocked && (
          <div className="guide-tabs">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                className={`guide-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="guide-content-body">
          {activeTab === 'board' && (
            <div className="guide-section">
              <p className="guide-intro">{content.board.intro}</p>

              {/* VEKTÖREL DART DİLİMİ ŞEMASI */}
              <div className="board-visual-card">
                <svg viewBox="0 0 340 230" className="dartboard-slice-svg" preserveAspectRatio="xMidYMid meet">
                  {/* Arka Plan Dilim Alanları */}
                  {/* Double Ring */}
                  <path d="M 120 15 A 150 150 0 0 1 220 15 L 208 32 A 130 130 0 0 0 132 32 Z" fill="#ff334b" stroke="#ffffff" strokeWidth="1" />
                  {/* Single Outer */}
                  <path d="M 132 32 A 130 130 0 0 1 208 32 L 190 70 A 90 90 0 0 0 150 70 Z" fill="#2b2c3a" stroke="#ffffff" strokeWidth="1" />
                  {/* Triple Ring */}
                  <path d="M 150 70 A 90 90 0 0 1 190 70 L 180 88 A 72 72 0 0 0 160 88 Z" fill="#ff334b" stroke="#ffffff" strokeWidth="1" />
                  {/* Single Inner */}
                  <path d="M 160 88 A 72 72 0 0 1 180 88 L 173 130 A 35 35 0 0 0 167 130 Z" fill="#2b2c3a" stroke="#ffffff" strokeWidth="1" />
                  {/* Outer Bull */}
                  <circle cx="170" cy="155" r="22" fill="#28a745" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Inner Bull */}
                  <circle cx="170" cy="155" r="10" fill="#dc3545" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Sayı İfadesi */}
                  <text x="170" y="11" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">20</text>

                  {/* İŞARETÇİ ÇİZGİLERİ VE ETİKETLER */}
                  {/* Double Line */}
                  <line x1="214" y1="23" x2="265" y2="23" stroke="#ff9800" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="265" y="13" width="65" height="18" rx="4" fill="#ff9800" />
                  <text x="297" y="25" fill="#000" fontSize="9" fontWeight="800" textAnchor="middle">DOUBLE (x2)</text>

                  {/* Single Outer Line */}
                  <line x1="75" y1="50" x2="140" y2="50" stroke="#4da6ff" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="10" y="41" width="65" height="18" rx="4" fill="#4da6ff" />
                  <text x="42" y="53" fill="#000" fontSize="9" fontWeight="800" textAnchor="middle">SINGLE (x1)</text>

                  {/* Triple Line */}
                  <line x1="185" y1="79" x2="265" y2="79" stroke="#e91e63" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="265" y="70" width="65" height="18" rx="4" fill="#e91e63" />
                  <text x="297" y="82" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">TRIPLE (x3)</text>

                  {/* Outer Bull Line */}
                  <line x1="75" y1="150" x2="150" y2="150" stroke="#28a745" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="10" y="141" width="65" height="18" rx="4" fill="#28a745" />
                  <text x="42" y="153" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">BULL (25)</text>

                  {/* Inner Bull Line */}
                  <line x1="170" y1="165" x2="170" y2="202" stroke="#dc3545" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="125" y="202" width="90" height="18" rx="4" fill="#dc3545" />
                  <text x="170" y="214" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">D-BULL (50)</text>
                </svg>
              </div>

              {/* DETAYLI AÇIKLAMA KARTLARI */}
              <div className="guide-list">
                {content.board.items.map((item, i) => (
                  <div key={i} className="guide-card">
                    <div className="guide-card-header">
                      <strong>{item.title}</strong>
                      <span className="guide-badge">{item.badge}</span>
                    </div>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'x01' && (
            <div className="guide-section">
              <p className="guide-intro">{content.x01.intro}</p>
              <ul className="guide-bullet-list">
                {content.x01.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'cricket' && (
            <div className="guide-section">
              <p className="guide-intro">{content.cricket.intro}</p>

              <div className="guide-symbols-grid">
                {content.cricket.marks.map((m, i) => (
                  <div key={i} className="symbol-item">
                    <span className="symbol-icon">{m.symbol}</span>
                    <span className="symbol-label">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="guide-list">
                {content.cricket.modes.map((mode, i) => (
                  <div key={i} className="guide-card">
                    <strong>{mode.title}</strong>
                    <span>{mode.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}