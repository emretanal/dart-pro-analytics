import { useState } from 'react';

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
      intro: 'Dart tahtası 1 ile 20 arasındaki sayılardan ve merkezdeki Bull bölgesinden oluşur:',
      items: [
        { title: 'Single (Tekli Alan):', desc: 'Siyah ve krem renkli geniş alanlar. Sayının kendi değerini verir (Örn: 20).' },
        { title: 'Double (Çiftli Halka - D):', desc: 'En dıştaki kırmızı/yeşil dar halka. Sayı değerini 2 ile çarpar (Örn: D20 = 40 Puan).' },
        { title: 'Triple (Üçlü Halka - T):', desc: 'İçteki kırmızı/yeşil dar halka. Sayı değerini 3 ile çarpar (Örn: T20 = 60 Puan).' },
        { title: 'Outer Bull (Dış Merkez - 25):', desc: 'Yeşil merkez halka. 25 puan değerindedir.' },
        { title: 'Inner / Double Bull (İç Merkez - 50):', desc: 'Kırmızı tam merkez. 50 puan değerindedir ve Double kuralında bitiş atışı sayılır.' },
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
      intro: 'A dartboard consists of numbers 1-20 and the central Bullseye:',
      items: [
        { title: 'Single Segment:', desc: 'The large black/cream areas. Scores face value (e.g., 20).' },
        { title: 'Double Ring (D):', desc: 'The outer narrow ring. Multiplies score by 2 (e.g., D20 = 40 Points).' },
        { title: 'Triple Ring (T):', desc: 'The inner narrow ring. Multiplies score by 3 (e.g., T20 = 60 Points).' },
        { title: 'Outer Bull (25):', desc: 'The outer green center circle. Worth 25 points.' },
        { title: 'Inner Bull / Double Bull (50):', desc: 'The inner red circle. Worth 50 points and counts as a double.' }
      ]
    },
    x01: {
      intro: '301, 501, and 701 are countdown games. The objective is to reach exactly 0 from your starting score.',
      steps: [
        'Each player throws 3 darts per turn.',
        'Points scored are subtracted from your remaining total.',
        'Double Out: The final winning dart must hit a Double (D) segment.',
        'Double In: If active, you must hit a double before you can start deducting points.',
        'BUST: Throwing more points than remaining (or leaving 1 point on Double Out) resets your turn.'
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

export default function HowToPlayModal({ isOpen, onClose, lang = 'tr' }) {
  const [activeTab, setActiveTab] = useState('board');
  if (!isOpen) return null;

  const content = GUIDE_CONTENT[lang] || GUIDE_CONTENT.tr;

  return (
    <div className="winner-overlay">
      <div className="history-modal guide-modal">
        <div className="guide-header">
          <h2>{content.title}</h2>
          <button className="btn-text" onClick={onClose}>{content.close}</button>
        </div>

        <div className="guide-tabs">
          {content.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`guide-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="guide-content-body">
          {activeTab === 'board' && (
            <div className="guide-section">
              <p className="guide-intro">{content.board.intro}</p>
              <div className="guide-list">
                {content.board.items.map((item, i) => (
                  <div key={i} className="guide-card">
                    <strong>{item.title}</strong>
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